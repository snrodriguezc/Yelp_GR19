import json

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from joblib import dump
from pandas import json_normalize
from pandas_profiling import ProfileReport
from sklearn.metrics import precision_recall_fscore_support, confusion_matrix
from sklearn.model_selection import train_test_split

from DataModel import DataModelTrain, DataModelPred, ListModelPred, ListModelTrain
from PredictionModel import PredictionModel
from ProcessingPipeline import ProcessingPipeline

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = PredictionModel()
pipeline = ProcessingPipeline()


@app.get("/")
def read_root():
    return {"Hello": "World"}


# Endpoint1. Recibe una lista de registros y hace predicciones sobre estos
@app.post("/predict")
def make_predictions(listModelPred: ListModelPred):
    # Transformacion de datos de JSON a dataframe
    dict = listModelPred.dict()
    df = json_normalize(dict['registros'])
    dfpred = DataModelPred

    df.columns = dfpred.columnsPred(dfpred)
    df = df['text']
    df = pipeline.process(df)
    # Predicciones a partir del modelo generado

    result = model.make_predictions(df)
    # Transformacion de datos a JSON
    resultList = result.tolist()
    resultJson = json.dumps(resultList)
    return resultJson


@app.post("/report")
def classification_report():
    f = open('assets/report.json')
    return json.load(f)

@app.post("/cmatrix")
def classification_report():
    f = open('assets/c_matrix.json')
    return json.load(f)



@app.post("/coefficients")
def coefficients():
    f = open('assets/coefficients.json')
    return json.load(f)
@app.post("/profile")
def coefficients():
    f = open('assets/profile.json')
    return json.load(f)

@app.post("/train")
def train(listModelTrain: ListModelTrain):
    # Transformacion de datos de JSON a dataframe
    dict = listModelTrain.dict()
    df = json_normalize(dict['registros'])
    dftrain = DataModelTrain
    df.columns = dftrain.columnsTrain(dftrain)
    df_prep = df.copy()
    ProfileReport(df_prep,   title='Profiling Report', explorative=True)

    profile = df_prep.profile_report()
    p = profile.to_json()
    y = json.loads(p)

    stars = df_prep.describe()

    my_profile = {"count": y['table']['n'], "n_var": y['table']["n_var"],
                  "n_cells_missing": y['table']["n_cells_missing"],
                  "n_vars_with_missing": y['table']["n_vars_with_missing"],
                  "n_vars_all_missing": y['table']["n_vars_all_missing"],
                  "p_cells_missing": y['table']["p_cells_missing"],
                  "n_duplicates": y['table']["n_duplicates"],
                  "p_duplicates": y['table']["p_duplicates"],

                  "stars": json.loads(stars.to_json())["stars"]
                  }

    with open("assets/profile.json", "w") as write_file:
        json.dump(my_profile, write_file)

    X_train, X_test, y_train, y_test = train_test_split(df_prep['text'], df_prep['stars'],
                                                        test_size=0.2, stratify=df_prep['stars'],
                                                        random_state=1)


    X_train = pipeline.pipeline.fit_transform(X_train).toarray()
    X_test = pipeline.pipeline.transform(X_test).toarray()

    dump(pipeline, "assets/pipeline.joblib")

    model.model.fit(X_train, y_train)
    dump(model, "assets/model.joblib")

    preds_test = model.model.predict(X_test)

    df_class_report = pandas_classification_report(y_test, preds_test)

    df_class_report.to_json("assets/report.json")

    # %%
    vocabulary = pipeline.pipeline.steps[1][1].vocabulary_

    coef = pd.DataFrame(model.model.coef_)
    coef.columns = vocabulary

    coef.to_json("assets/coefficients.json")

    cm_test = pd.DataFrame(confusion_matrix(y_test, preds_test, labels=model.model.classes_))
    cm_test_norm = pd.DataFrame(confusion_matrix(y_test, preds_test, labels=model.model.classes_, normalize='all'))

    cm_test.to_json("assets/c_matrix.json")
    cm_test_norm.to_json("assets/c_matrix_norm.json")

    return df_class_report


def pandas_classification_report(y_true, y_pred):
    metrics_summary = precision_recall_fscore_support(
        y_true=y_true,
        y_pred=y_pred)

    avg = list(precision_recall_fscore_support(
        y_true=y_true,
        y_pred=y_pred,
        average='weighted'))

    metrics_sum_index = ['precision', 'recall', 'f1-score', 'support']
    class_report_df = pd.DataFrame(
        list(metrics_summary),
        index=metrics_sum_index)

    support = class_report_df.loc['support']
    total = support.sum()
    avg[-1] = total

    class_report_df['avg'] = avg

    return class_report_df.T


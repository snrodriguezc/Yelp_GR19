from tokenize import String
import pandas as pd
from pandas import json_normalize
import numpy as np
from joblib import dump, load
from fastapi import FastAPI
import json
from pydantic import Json

from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_squared_error as mse

from DataModel import DataModelTrain, DataModelPred, ListModelPred, ListModelTrain
from PredictionModel import PredictionModel
from ProcessingPipeline import  ProcessingPipeline

app = FastAPI()
model = PredictionModel()
pipeline = ProcessingPipeline()


@app.get("/")
def read_root():
   return {"Hello": "World"}

#Endpoint1. Recibe una lista de registros y hace predicciones sobre estos
@app.post("/predict")
def make_predictions(listModelPred: ListModelPred):
    #Transformacion de datos de JSON a dataframe
    dict = listModelPred.dict()
    df = json_normalize(dict['registros'])
    dfpred = DataModelPred

    df.columns = dfpred.columnsPred(dfpred)
    df = df['text']
    df = pipeline.process(df)
    #Predicciones a partir del modelo generado


    result = model.make_predictions(df)
    #Transformacion de datos a JSON
    resultList = result.tolist()
    resultJson = json.dumps(resultList)
    return resultJson

@app.post("/report")
def classification_report():
    f = open('assets/report.json')
    data = json.load(f)
    return data

@app.post("/coefficients")
def coefficients():
    f = open('assets/coefficients.json')
    data = json.load(f)
    return data

@app.post("/train")
def train(listModelTrain: ListModelTrain):
    #Transformacion de datos de JSON a dataframe
    dict = listModelTrain.dict()
    df = json_normalize(dict['registros'])
    dftrain = DataModelTrain
    df.columns = dftrain.columnsTrain(dftrain)
    df_prep = df.copy()
    var_obj = 'stars'
    df_prep = df_prep.dropna(subset=[var_obj])

    #Entrenamiento con datos de entrada
    df_lineal = df_prep.copy()
    X = df_lineal['text']
    y = df_lineal[var_obj]

    X = pipeline.process(X)



    model.model.fit(X,y)

    #Generacion de metricas de calidad del modelo
    r2 = model.model.score(X,y)

    y_true = y
    y_predicted = model.model.predict(X)
    
    rmse = np.sqrt(mse(y_true, y_predicted))

    #Almacenamiento del modelo generado
    filename = 'model2.joblib'
    dump(model.model, "./assets/"+filename)

    return {
        "R2": r2,
        "RMSE": rmse
    }

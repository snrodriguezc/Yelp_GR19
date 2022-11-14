# Se cargan los datos.
import json

import pandas as pd
from sklearn.utils import resample

file_name = 'reviews_train_val.csv'
reviews_df = pd.read_csv('data/reviews_train_val.csv', sep = ',')

neg_class_resampled = resample(
    reviews_df, replace=False, n_samples=4000,
    random_state=1234,
)
reviews_df = neg_class_resampled
myjson = {"registros": []}

for ind in reviews_df.index:
    myjson["registros"].append({"text": reviews_df['text'][ind], "stars": float(reviews_df['stars'][ind])} )


with open("Data/data.json", "w") as write_file:
    json.dump(myjson, write_file)



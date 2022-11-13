from __future__ import annotations

from pydantic import BaseModel

#Representa el esquema de los datos de entrada para el entrenamiento
class DataModelTrain(BaseModel):
    text: str
    stars: int

    #Representa las columnas del dataframe para el entrenamiento
    def columnsTrain(self):
        return ["text", "stars"]

#Representa el esquema de los datos de entrada para las predicciones
class DataModelPred(BaseModel):
    text: str


    #Representa las columnas del dataframe para las predicciones
    def columnsPred(self):
        return ["text"]

#Clase para extraer la lista de registros dados para las predicciones
class ListModelPred(BaseModel):
    registros: list[DataModelPred]

#Clase para extraer la lista de registros dados para el entrenamiento
class ListModelTrain(BaseModel):
    registros: list[DataModelTrain]

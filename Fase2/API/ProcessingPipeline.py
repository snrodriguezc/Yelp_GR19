from joblib import load

class ProcessingPipeline:

    #Inicia cargando el modelo generado
    def __init__(self):
        self.pipeline = load("assets/pipeline.joblib")

    #Hace las predicciones a partir del modelo generado
    def process(self, data):
        result = self.pipeline.transform(data)
        return result


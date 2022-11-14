# Proyecto 1 Etapa 2: YELP

## Entregables
* [Script](https://github.com/snrodriguezc/Yelp_GR19/blob/main/Fase2/API/Pipeline.ipynb) de Jupyter Lab con la construcción del pipeline y la explicación de cada uno de los pasos que lo componen.
* [Código fuente](https://github.com/snrodriguezc/Yelp_GR19/tree/main/Fase2/API) de la API con los endpoints descritos en el enunciado.
* Archivo [README](https://github.com/snrodriguezc/Yelp_GR19/blob/main/Fase2/README.md) con las instrucciones de uso de la aplicación
* [Documento PDF](https://github.com/snrodriguezc/Yelp_GR19/tree/main/Fase2/Proyecto1_Etapa2_GR19.pdf) que describe el proceso de despliegue de la solución analítica en el ambiente de producción de una organización

## Despliegue de API en ambiente local
1. Ubicarse en la carpeta raiz del proyecto: ./API
2. Abrir una nueva terminal
3. Correr el servidor con el comando: 
```
uvicorn main:app --reload
```

## Uso de la aplicación
1. Modificar el archivo [urlConstants.js] (https://github.com/snrodriguezc/Yelp_GR19/blob/main/Fase2/front/src/constants/urlConstants.js) para que apunte al back ya ejecutado
2. Ejecutar el front
```
npm start
```

## Ejemplo de uso
[Enlace](https://youtu.be/fjoWNtMqNPc) al video de demostración

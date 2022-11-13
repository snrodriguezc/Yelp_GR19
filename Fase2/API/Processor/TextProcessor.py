import string

import pandas as pd
import warnings; warnings.simplefilter('ignore')
import re as regularExpr, unicodedata
import contractions
##from pandas_profiling import ProfileReport
from nltk.corpus import stopwords
from nltk.stem import LancasterStemmer, WordNetLemmatizer
from nltk import word_tokenize

from typing import Any, Union, List, re
from sklearn.base import BaseEstimator, TransformerMixin



def remove_non_ascii(words):
    """Remove non-ASCII characters from list of tokenized words"""
    new_words = []
    for word in words:
        new_word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('utf-8', 'ignore')
        new_words.append(new_word)
    return new_words

def to_lowercase(words):
    """Convert all characters to lowercase from list of tokenized words"""
    new_words = []
    for word in words:
        new_word = word.lower()
        new_words.append(new_word)
    return new_words

def remove_punctuation(words):
    """Remove punctuation from list of tokenized words"""
    new_words = []
    for word in words:
        new_word = regularExpr.sub(r'[^\w\s]', '', word)
        if new_word != '':
            new_words.append(new_word)
    return new_words

def remove_stopwords(words):
    """Remove stop words from list of tokenized words"""
    new_words = []
    cachedStopWords = stopwords.words("english")

    for word in words:
        if word not in cachedStopWords:
            if word == 'one' or word == 'also': continue
            new_words.append(word)
    return new_words

def preprocessing(words):
    words = to_lowercase(words)
    words = remove_punctuation(words)
    words = remove_non_ascii(words)
    words = remove_stopwords(words)
    return words

def stem_words(words):
    """Stem words in list of tokenized words"""
    stemmer = LancasterStemmer()
    stems = []
    for word in words:
        stem = stemmer.stem(word)
        stems.append(stem)
    return stems

def lemmatize_verbs(words):
    """Lemmatize verbs in list of tokenized words"""
    lemmatizer = WordNetLemmatizer()
    lemmas = []
    for word in words:
        lemma = lemmatizer.lemmatize(word, pos='v')
        lemmas.append(lemma)
    return lemmas

def stem_and_lemmatize(words):
    stems = stem_words(words)
    lemmas = lemmatize_verbs(words)
    return stems + lemmas


class TextProcesser(BaseEstimator, TransformerMixin):


    def fit(self, X: Any, y: Any = None) -> Any:
        return self

    def transform(
        self,
        X: Union[List[str], pd.Series],
    ) -> pd.Series:
        if isinstance(X, list):
            X = pd.Series(X)

        X = X.apply(contractions.fix)

        X = X.apply(word_tokenize)

        X = X.apply(preprocessing)

        X = X.apply(stem_and_lemmatize)

        X = X.apply(lambda x: " ".join(map(str, x)))


        return X

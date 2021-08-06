from pydantic import BaseSettings


class Settings(BaseSettings):
    mongo_url:str = 'mongodb://localhost:27017/'
    secret_key:str = 'eab28d297bbf9e2c77567c2dc81a475f' # TODO: Move to an env variable or docker secret
    preload_data:bool = True

    class Config:
        env_prefix = 'novus_'


settings = Settings()

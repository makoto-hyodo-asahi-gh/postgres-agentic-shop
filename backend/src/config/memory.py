from mem0 import Memory
from src.config.config import settings


def get_mem0_memory() -> Memory:
    return Memory.from_config(settings.get_mem0_memory_config())

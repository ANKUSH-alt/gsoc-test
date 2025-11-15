"""Models for EchoGem library."""

from dataclasses import dataclass
from typing import Optional


@dataclass
class ChunkingOptions:
    """Options for chunking transcripts."""
    max_chunk_size: int = 500
    overlap: int = 50
    semantic_chunking: bool = True


@dataclass
class QueryOptions:
    """Options for querying/asking questions."""
    show_chunks: bool = False
    show_prompt_answers: bool = False
    max_chunks: int = 3


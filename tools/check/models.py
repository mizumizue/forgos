from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Failure:
    code: str
    message: str
    path: str | None = None


@dataclass(frozen=True)
class CheckResult:
    failures: tuple[Failure, ...]

    @property
    def ok(self) -> bool:
        return not self.failures

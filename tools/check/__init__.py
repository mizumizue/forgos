"""ForgOS minimal mechanical gates (invariants only; not human approval)."""

from .models import CheckResult, Failure
from .runner import run_checks

__all__ = ["CheckResult", "Failure", "run_checks"]

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
}

# Minimal placeholder: examples IaC without cloud credentials.
resource "null_resource" "taskboard_marker" {
  triggers = {
    app = "taskboard-example"
  }
}

output "example_app" {
  value = "taskboard"
}

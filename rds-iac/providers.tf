terraform {
  required_version = ">=0.13.1"
  required_providers {
    aws   = ">=5.80.0"
    local = ">=2.5.2"
  }
}

provider "aws" {
  region = var.region
}

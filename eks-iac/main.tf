module "vpc" {
  source         = "./modules/vpc"
  prefix         = var.prefix
  vpc_cidr_block = var.vpc_cidr_block
}

module "eks" {
  source             = "./modules/eks"
  vpc_id             = module.vpc.vpc_id
  prefix             = var.prefix
  cluster_name       = var.cluster_name
  public_subnet_ids  = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  min_size           = var.min_size
  max_size           = var.max_size
  desired_size       = var.desired_size
  retention_log_days = var.retention_log_days
}

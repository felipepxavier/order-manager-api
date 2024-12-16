

data "aws_vpc" "selected_vpc" {
  filter {
    name   = "tag:Name"
    values = ["order_manager_vpc"]
  }
}

data "aws_subnets" "private_subnets" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.selected_vpc.id]
  }

  filter {
    name   = "tag:Name"
    values = ["order_manager_private_subnet_*"]
  }
}

data "aws_security_group" "eks_sg" {
  filter {
    name   = "tag:Name"
    values = ["order_manager_cluster_sg"]
  }

  vpc_id = data.aws_vpc.selected_vpc.id
}

resource "aws_db_subnet_group" "rds_private_subnet_group" {
  name       = "${var.prefix}_rds_private_subnet_group"
  subnet_ids = data.aws_subnets.private_subnets.ids

  tags = {
    Name = "${var.prefix}_rds_private_subnet_group"
  }
}

resource "aws_security_group" "rds_sg" {
  name   = "rds_security_group"
  vpc_id = data.aws_vpc.selected_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [data.aws_security_group.eks_sg.id] # Permite tráfego apenas do EKS
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.prefix}_rds_security_group"
  }
}

resource "aws_db_instance" "rds_instance" {
  allocated_storage      = 10
  db_name                = var.db_name
  identifier             = "${var.prefix}-rds-instance"
  engine                 = var.engine
  engine_version         = var.engine_version
  instance_class         = var.instance_class
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.rds_private_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id] # Garantir que o RDS usa o security group correto
  skip_final_snapshot    = true

  tags = {
    Name = "${var.prefix}_rds_instance"
  }
}






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

resource "aws_db_subnet_group" "rds_private_subnet_group" {
  name       = "${var.prefix}_rds_private_subnet_group"
  subnet_ids = data.aws_subnets.private_subnets.ids

  tags = {
    Name = "${var.prefix}_rds_private_subnet_group"
  }
}


resource "aws_db_instance" "rds_instance" {
  allocated_storage    = 10
  db_name              = var.db_name
  identifier           = "${var.prefix}-rds-instance"
  engine               = var.engine
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  username             = var.db_username
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.rds_private_subnet_group.name
  skip_final_snapshot  = true

  tags = {
    Name = "${var.prefix}_rds_instance"
  }
}



resource "aws_security_group" "order_manager_cluster_sg" {
  vpc_id = aws_vpc.order_manager_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.prefix}_cluster_sg"
  }
}

resource "aws_iam_role" "eks_cluster_role" {
  name               = "${var.cluster_name}_role"
  assume_role_policy = <<POLICY
    {
    "Version": "2012-10-17",
    "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "eks.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }
    POLICY
}

resource "aws_iam_role_policy_attachment" "eks_cluster_role_AmazonEKSVPCResourceControllery" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
}

resource "aws_iam_role_policy_attachment" "eks_cluster_role_AmazonEKSClusterPolicy" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}


resource "aws_cloudwatch_log_group" "cluster_log" {
  name              = "/aws/eks/${var.cluster_name}/cluster"
  retention_in_days = var.retention_log_days
}

resource "aws_eks_cluster" "eks_cluster" {
  name                      = var.cluster_name
  role_arn                  = aws_iam_role.eks_cluster_role.arn
  enabled_cluster_log_types = ["api", "audit"]

  vpc_config {
    subnet_ids = flatten([
      aws_subnet.public_subnets[*].id,
      aws_subnet.private_subnets[*].id
    ])
    security_group_ids = [aws_security_group.order_manager_cluster_sg.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_role_AmazonEKSVPCResourceControllery,
    aws_iam_role_policy_attachment.eks_cluster_role_AmazonEKSClusterPolicy,
    aws_cloudwatch_log_group.cluster_log,
  ]
}

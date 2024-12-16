resource "aws_security_group" "order_manager_cluster_sg" {
  vpc_id = var.vpc_id

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
      var.public_subnet_ids,
      var.private_subnet_ids,
    ])
    security_group_ids = [aws_security_group.order_manager_cluster_sg.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_role_AmazonEKSVPCResourceControllery,
    aws_iam_role_policy_attachment.eks_cluster_role_AmazonEKSClusterPolicy,
    aws_cloudwatch_log_group.cluster_log,
  ]
}

resource "aws_iam_role" "eks_cluster_node_role" {
  name               = "${var.cluster_name}_node_role"
  assume_role_policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
        "Effect": "Allow",
        "Principal": {
            "Service": "ec2.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
        }
    ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "eks_cluster_node_role_AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_cluster_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cluster_node_role_AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_cluster_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cluster_node_role_AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_cluster_node_role.name
}

resource "aws_eks_node_group" "eks_cluster_node_1" {
  cluster_name    = aws_eks_cluster.eks_cluster.name
  node_group_name = "eks_cluster_node_1"
  node_role_arn   = aws_iam_role.eks_cluster_node_role.arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = ["t3.small"]


  scaling_config {
    desired_size = var.desired_size
    min_size     = var.min_size
    max_size     = var.max_size
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_node_role_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.eks_cluster_node_role_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.eks_cluster_node_role_AmazonEC2ContainerRegistryReadOnly,
  ]
}

# resource "aws_eks_node_group" "eks_cluster_node_2" {
#   cluster_name    = aws_eks_cluster.eks_cluster.name
#   node_group_name = "eks_cluster_node_2"
#   node_role_arn   = aws_iam_role.eks_cluster_node_role.arn
#   subnet_ids      = var.private_subnet_ids
#   instance_types  = ["t3.micro"]

#   scaling_config {
#     desired_size = var.desired_size
#     min_size     = var.min_size
#     max_size     = var.max_size
#   }

#   depends_on = [
#     aws_iam_role_policy_attachment.eks_cluster_node_role_AmazonEKSWorkerNodePolicy,
#     aws_iam_role_policy_attachment.eks_cluster_node_role_AmazonEKS_CNI_Policy,
#     aws_iam_role_policy_attachment.eks_cluster_node_role_AmazonEC2ContainerRegistryReadOnly,
#   ]
# }

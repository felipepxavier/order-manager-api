locals {
  kubeconfig = <<KUBECONFIG
apiVersion: v1
clusters:
- cluster:
    server: ${aws_eks_cluster.eks_cluster.endpoint}
    certificate-authority-data: ${aws_eks_cluster.eks_cluster.certificate_authority[0].data}
  name: "${aws_eks_cluster.eks_cluster.name}"
contexts:
- context:
    cluster: "${aws_eks_cluster.eks_cluster.name}"
    user: "${aws_eks_cluster.eks_cluster.name}"
  name: "${aws_eks_cluster.eks_cluster.name}"
  current-context: "${aws_eks_cluster.eks_cluster.name}"
kind: Config
preferences: {}
users:
- name: ${aws_eks_cluster.eks_cluster.name}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1
      command: aws-iam-authenticator
      args:
        - "token"
        - "-i"
        - "${aws_eks_cluster.eks_cluster.name}"
      interactiveMode: Always 
KUBECONFIG
}

resource "local_file" "kubeconfig" {
  filename = "kubeconfig"
  content  = local.kubeconfig
}

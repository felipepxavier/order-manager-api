output "db_info" {
  value = {
    public_ip_address = aws_db_instance.rds_instance.endpoint
    database          = var.db_name
    user              = var.db_username
    password          = var.db_password
    sensitive         = true
  }
  sensitive = true
}

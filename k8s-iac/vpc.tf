resource "aws_vpc" "order_manager_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "${var.prefix}_vpc"
  }
}

data "aws_availability_zones" "available" {}

resource "aws_subnet" "public_subnets" {
  count                   = 2
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  vpc_id                  = aws_vpc.order_manager_vpc.id
  cidr_block              = "10.0.${1 + count.index}.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.prefix}_public_subnet_${1 + count.index}"
  }
}

resource "aws_subnet" "private_subnets" {
  count                   = 2
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  vpc_id                  = aws_vpc.order_manager_vpc.id
  cidr_block              = "10.0.${3 + count.index}.0/24"
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.prefix}_private_subnet_${3 + count.index}"
  }
}

resource "aws_internet_gateway" "new_igw" {
  vpc_id = aws_vpc.order_manager_vpc.id

  tags = {
    Name = "${var.prefix}_igw"
  }
}

resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.order_manager_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.new_igw.id
  }

  tags = {
    Name = "${var.prefix}_public_rtb"
  }
}

resource "aws_route_table_association" "public_subnet_association" {
  count          = 2
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_rtb.id
}

# Criando a NAT Gateway
resource "aws_eip" "nat_gateway_eip" {
  associate_with_private_ip = true
}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.nat_gateway_eip.id
  subnet_id     = aws_subnet.public_subnets[0].id # Usando a subnet pública para a NAT Gateway

  tags = {
    Name = "${var.prefix}_nat_gateway"
  }
}

# Criando a tabela de roteamento para subnets privadas
resource "aws_route_table" "private_rtb" {
  vpc_id = aws_vpc.order_manager_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway.id
  }

  tags = {
    Name = "${var.prefix}_private_rtb"
  }
}

# Associe a tabela de roteamento com as subnets privadas
resource "aws_route_table_association" "private_subnet_association" {
  count          = 2
  subnet_id      = aws_subnet.private_subnets[count.index].id
  route_table_id = aws_route_table.private_rtb.id
}



resource "aws_api_gateway_rest_api" "website" {
  name = "${var.prefix}-api-gateway"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "website" {
  depends_on  = [aws_api_gateway_integration.search]
  rest_api_id = aws_api_gateway_rest_api.website.id
  stage_name  = "api"
}

# resource "aws_api_gateway_resource" "proxy" {
#   rest_api_id = aws_api_gateway_rest_api.website.id
#   parent_id   = aws_api_gateway_rest_api.website.root_resource_id
#   path_part   = "{proxy+}"
# }

# resource "aws_api_gateway_method" "any" {
#   rest_api_id   = aws_api_gateway_rest_api.website.id
#   resource_id   = aws_api_gateway_rest_api.website.root_resource_id
#   http_method   = "ANY"
#   authorization = "NONE"
# }

# resource "aws_api_gateway_method" "proxy" {
#   rest_api_id   = aws_api_gateway_rest_api.website.id
#   resource_id   = aws_api_gateway_resource.proxy.id
#   http_method   = "ANY"
#   authorization = "NONE"
# }

# resource "aws_api_gateway_integration" "any" {
#   rest_api_id             = aws_api_gateway_rest_api.website.id
#   resource_id             = aws_api_gateway_rest_api.website.root_resource_id
#   http_method             = aws_api_gateway_method.any.http_method
#   integration_http_method = "POST"
#   type                    = "AWS_PROXY"
#   uri                     = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${aws_lambda_function.sentiment_api.arn}/invocations"
# }

# resource "aws_api_gateway_integration" "proxy" {
#   rest_api_id             = aws_api_gateway_rest_api.website.id
#   resource_id             = aws_api_gateway_resource.proxy.id
#   http_method             = aws_api_gateway_method.proxy.http_method
#   integration_http_method = "POST"
#   type                    = "AWS_PROXY"
#   uri                     = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${aws_lambda_function.sentiment_api.arn}/invocations"
# }

// New Path
resource "aws_api_gateway_resource" "search" {
  rest_api_id = aws_api_gateway_rest_api.website.id
  parent_id   = aws_api_gateway_rest_api.website.root_resource_id
  path_part   = "search"
}

resource "aws_api_gateway_method" "search" {
  rest_api_id   = aws_api_gateway_rest_api.website.id
  resource_id   = aws_api_gateway_resource.search.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "search" {
  rest_api_id             = aws_api_gateway_rest_api.website.id
  resource_id             = aws_api_gateway_resource.search.id
  http_method             = aws_api_gateway_method.search.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${aws_lambda_function.sentiment_api.arn}/invocations"
}

output "api_gateway_invoke_url" {
  value       = aws_api_gateway_deployment.website.invoke_url
  description = "API Gateway Deployment Invoke URL"
}

output "api_gateway_id" {
  value       = aws_api_gateway_rest_api.website.id
  description = "API Gateway Deployment ID"
}

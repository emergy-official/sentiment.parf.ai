
resource "aws_api_gateway_rest_api" "website" {
  name = "${var.prefix}-api-gateway"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "website" {
  # depends_on  = [aws_api_gateway_integration.feedback,aws_api_gateway_integration.sentiment]
  rest_api_id = aws_api_gateway_rest_api.website.id
  stage_name  = "api"
}

// Feedback
resource "aws_api_gateway_resource" "feedback" {
  rest_api_id = aws_api_gateway_rest_api.website.id
  parent_id   = aws_api_gateway_resource.sentiment.id
  path_part   = "feedback"
}

resource "aws_api_gateway_method" "feedback" {
  rest_api_id   = aws_api_gateway_rest_api.website.id
  resource_id   = aws_api_gateway_resource.feedback.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "feedback" {
  rest_api_id             = aws_api_gateway_rest_api.website.id
  resource_id             = aws_api_gateway_resource.feedback.id
  http_method             = aws_api_gateway_method.feedback.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${aws_lambda_function.feedback_api.arn}/invocations"
}

// Sentiment
resource "aws_api_gateway_resource" "sentiment" {
  rest_api_id = aws_api_gateway_rest_api.website.id
  parent_id   = aws_api_gateway_rest_api.website.root_resource_id
  path_part   = "sentiment"
}

resource "aws_api_gateway_method" "sentiment" {
  rest_api_id   = aws_api_gateway_rest_api.website.id
  resource_id   = aws_api_gateway_resource.sentiment.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "sentiment" {
  rest_api_id             = aws_api_gateway_rest_api.website.id
  resource_id             = aws_api_gateway_resource.sentiment.id
  http_method             = aws_api_gateway_method.sentiment.http_method
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

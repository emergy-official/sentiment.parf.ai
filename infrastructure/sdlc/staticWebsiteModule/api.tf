# Create Lambda function to perform CRUD operations on DynamoDB table    
resource "aws_lambda_function" "sentiment_api" {
  function_name = "${var.prefix}_api"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_exec_sentiment_api.arn
  runtime       = "nodejs20.x"
  filename      = data.archive_file.lambda_sentiment_api_zip.output_path
  # Do not update the lambda, it will be done by Github CI/CD
  source_code_hash = data.archive_file.lambda_sentiment_api_zip.output_base64sha256

  timeout     = 10
  memory_size = 128
  environment {
    variables = {
    }
  }
}

# resource "aws_lambda_function_url" "sentiment_api" {
#   function_name      = aws_lambda_function.sentiment_api.function_name
#   authorization_type = "NONE"

#   cors {
#     allow_origins  = ["*"]
#     allow_methods  = ["*"]
#     allow_headers  = ["*"]
#     expose_headers = ["*"]
#     max_age        = 0
#   }
# }

# IAM role for the Lambda function to access necessary resources  
resource "aws_iam_role" "lambda_exec_sentiment_api" {
  name = "${var.prefix}_lambda_exec_sentiment_api"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_exec_policy_sentiment_api" {
  name = "${var.prefix}_lambda_exec_policy_sentiment_api"
  role = aws_iam_role.lambda_exec_sentiment_api.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
    ]
  })
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sentiment_api.arn
  principal     = "apigateway.amazonaws.com"

  # If you have set up an AWS Account Alias, use this line instead  
  # source_arn = "arn:aws:execute-api:${var.region_name}:${var.aws_account_id}:${aws_api_gateway_rest_api.example.id}/${aws_api_gateway_deployment.example.stage_name}/ANY/RESOURCE_PATH"  

  source_arn = "arn:aws:execute-api:${var.region_name}:${var.aws_account_id}:${aws_api_gateway_rest_api.website.id}/*/*/*"
}

# Code of the lambda functions
data "archive_file" "lambda_sentiment_api_zip" {
  type        = "zip"
  source_dir  = "${var.api_path}/"
  output_path = "${var.api_path}/../dist/ssr_dist.zip"
}

# Verify SES email addresses  
resource "aws_ses_email_identity" "sender_verification" {
  email = "it@parf.ai"
}

resource "aws_ses_email_identity" "recipient_verification" {
  email = "contact@parf.ai"
}

# Create Lambda function to perform CRUD operations on DynamoDB table    
resource "aws_lambda_function" "email_alert" {
  function_name = "${var.prefix}_email_alert"
  handler       = "sendEmailAlert.handler"
  role          = aws_iam_role.lambda_exec_email.arn
  runtime       = "nodejs20.x"
  filename      = data.archive_file.lambda_backend_zip.output_path
  # Do not update the lambda, it will be done by Github CI/CD
  source_code_hash = data.archive_file.lambda_backend_zip.output_base64sha256
  layers           = [aws_lambda_layer_version.lambda_feedback_api_lambda_layer.arn]

  timeout     = 10
  memory_size = 128
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.feedback.name
      TO_EMAIL   = "contact@parf.ai"
      FROM_EMAIL = "it@parf.ai"
    }
  }
}

resource "aws_cloudwatch_log_group" "email" {
  name              = "/aws/lambda/${aws_lambda_function.email_alert.function_name}"
  retention_in_days = 3
}

# IAM role for the Lambda function to access necessary resources  
resource "aws_iam_role" "lambda_exec_email" {
  name = "${var.prefix}_lambda_exec_email"

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

resource "aws_iam_role_policy" "lambda_exec_policy_email" {
  name = "${var.prefix}_lambda_exec_policy_email"
  role = aws_iam_role.lambda_exec_email.id

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

resource "aws_iam_role_policy" "lambda_exec_policy_email_db" {
  name = "${var.prefix}_lambda_exec_policy_email_db"
  role = aws_iam_role.lambda_exec_email.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:Query",
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.feedback.arn
      },
    ]
  })
}

resource "aws_iam_role_policy" "lambda_exec_policy_email_ses" {
  name = "${var.prefix}_lambda_exec_policy_email_ses"
  role = aws_iam_role.lambda_exec_email.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

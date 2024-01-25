resource "aws_iam_role_policy" "update_lambda_policy" {
  name = "${var.prefix}-update-lambda-policy"
  role = var.github_action_role_id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "UpdateLambda",
        "Effect" : "Allow",
        "Action" : [
          "lambda:UpdateFunctionCode"
        ],
        "Resource" : "${aws_lambda_function.sentiment_api.arn}"
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecr_login_policy" {
  name = "${var.prefix}-ecr-login"
  role = var.github_action_role_id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "ERCLogin",
        "Effect" : "Allow",
        "Action" : [
          "ecr:GetAuthorizationToken"
        ],
        "Resource" : "*"
      }
    ]
  })
}

// https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-push.html
resource "aws_iam_role_policy" "ecr_push_policy" {
  name = "${var.prefix}-ecr-push"
  role = var.github_action_role_id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "ECRPush",
        "Effect" : "Allow",
        "Action" : [
          "ecr:CompleteLayerUpload",
          "ecr:GetAuthorizationToken",
          "ecr:UploadLayerPart",
          "ecr:InitiateLayerUpload",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage"
        ],
        "Resource" : "${aws_ecr_repository.python_scikit_learn.arn}"
      }
    ]
  })
}

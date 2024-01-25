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
        "Resource" : "${aws_lambda_function.feedback_api.arn}"
      }
    ]
  })
}

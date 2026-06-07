// pipeline 
pipeline {
  agent any

  parameters {
    string(name: 'REPO_URL', defaultValue: 'https://github.com/Sarvnoor-kaur/docker-jenikns-kubernetees.git', description: 'GitHub repository URL')
    string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build')
    string(name: 'KUBECONFIG_PATH', defaultValue: 'C:\\ProgramData\\Jenkins\\.kube\\config', description: 'Windows kubeconfig path')
    string(name: 'DOCKERHUB_CREDENTIALS_ID', defaultValue: 'dockerhub', description: 'Jenkins Docker Hub credentials ID')
    string(name: 'BACKEND_IMAGE_NAME', defaultValue: 'sarvnoorkaur/backend', description: 'Docker Hub backend image name')
    string(name: 'FRONTEND_IMAGE_NAME', defaultValue: 'sarvnoorkaur/frontend', description: 'Docker Hub frontend image name')
    string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Docker image tag')
  }

  environment {
    KUBECONFIG = "${params.KUBECONFIG_PATH}"

        // Kubernetes config (Windows Jenkins fix)
        KUBECONFIG = "C:\\ProgramData\\Jenkins\\.kube\\config"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Sarvnoor-kaur/docker-jenikns-kubernetees.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    bat """
                        echo %PASS% | docker login -u %USER% --password-stdin
                    """
                }
            }
        }

        stage('Push Image') {
            steps {
                bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        stage('Deploy To Kubernetes') {
            steps {
                bat """
                    echo Using kubeconfig: %KUBECONFIG%

                    REM Apply deployment and service
                    kubectl apply -f deployment.yaml
                    kubectl apply -f service.yaml

                    REM Update image in deployment
                    kubectl set image deployment/docker-jenknins-kuber-deployment ^
                    web-container=%IMAGE_NAME%:%IMAGE_TAG%

                    REM Wait for rollout
                    kubectl rollout status deployment/docker-jenknins-kuber-deployment
                """
            }
        }

        // 🔥 NEW STAGE ADDED HERE
        stage('Verify Deployment') {
            steps {
                bat """
                    echo ===== Checking Kubernetes Resources =====

                    echo --- Deployments ---
                    kubectl get deployments

                    echo --- Pods ---
                    kubectl get pods

                    echo --- Services ---
                    kubectl get svc

                    echo --- Rollout Status ---
                    kubectl rollout status deployment/docker-jenknins-kuber-deployment
                """
            }
        }

        stage('Check Kubernetes') {
            steps {
                bat "kubectl get nodes"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs."
        }
    }
}
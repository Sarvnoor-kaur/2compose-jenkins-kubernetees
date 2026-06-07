pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "sarvnoorkaur/frontend-app:latest"
        BACKEND_IMAGE  = "sarvnoorkaur/backend-app:latest"

        // Kubernetes config (Windows Jenkins fix)
        KUBECONFIG = "C:\\ProgramData\\Jenkins\\.kube\\config"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Sarvnoor-kaur/2compose-jenkins-kubernetees.git'
            }
        }

        // ================= BUILD IMAGES =================
        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building backend image..."
                    bat "docker build -t %BACKEND_IMAGE% ./backend"

                    echo "Building frontend image..."
                    bat "docker build -t %FRONTEND_IMAGE% ./frontend"
                }
            }
        }

        // ================= DOCKER LOGIN =================
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

        // ================= PUSH IMAGES =================
        stage('Push Images') {
            steps {
                script {
                    echo "Pushing backend image..."
                    bat "docker push %BACKEND_IMAGE%"

                    echo "Pushing frontend image..."
                    bat "docker push %FRONTEND_IMAGE%"
                }
            }
        }

        // ================= DEPLOY TO KUBERNETES =================
        stage('Deploy To Kubernetes') {
            steps {
                bat """
            

                    echo Applying Kubernetes manifests...
                    kubectl apply -f deployment.yaml
                    kubectl apply -f service.yaml

                    echo Updating frontend image...
                    kubectl set image deployment/docker-jenknins-kuber-deployment ^
                    web-container=%FRONTEND_IMAGE%

                    kubectl rollout status deployment/docker-jenknins-kuber-deployment
                """
            }
        }

        // ================= VERIFY =================
        stage('Verify Deployment') {
            steps {
                bat """
                    echo ===== Kubernetes Status =====

                    kubectl get deployments
                    kubectl get pods
                    kubectl get svc

                    kubectl rollout status deployment/docker-jenknins-kuber-deployment
                """
            }
        }

        // ================= CHECK CLUSTER =================
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
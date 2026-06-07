pipeline {
  agent any

  parameters {
    string(name: 'REPO_URL', defaultValue: 'https://github.com/Sarvnoor-kaur/2compose-jenkins-kubernetees.git', description: 'GitHub repository URL')
    string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build')
  }

  environment {
    KUBECONFIG = 'C:\\Users\\jenkins\\.kube\\config'
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Checking out source code from GitHub...'
        git branch: "${params.BRANCH}", url: "${params.REPO_URL}"
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          echo 'Building backend image...'
          bat 'docker build -t backend:latest .\\backend'

          echo 'Building frontend image...'
          bat 'docker build -t frontend:latest .\\frontend'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          echo 'Applying Kubernetes deployment manifests...'
          bat 'kubectl apply -f deployment.yml'
          bat 'kubectl apply -f service.yml'
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        script {
          echo 'Getting deployments, services, and pods...'
          bat 'kubectl get deployments -o wide'
          bat 'kubectl get services -o wide'
          bat 'kubectl get pods -o wide'
        }
      }
    }
  }

  post {
    always {
      echo 'Jenkins pipeline finished.'
    }
  }
}

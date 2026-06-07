pipeline {
  agent any

  parameters {
    string(name: 'REPO_URL', defaultValue: 'https://github.com/youruser/yourrepo.git', description: 'GitHub repository URL')
    string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch to build')
  }

  environment {
    KUBECONFIG = '/root/.kube/config'
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
          sh 'docker build -t backend:latest ./backend'

          echo 'Building frontend image...'
          sh 'docker build -t frontend:latest ./frontend'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          echo 'Applying Kubernetes deployment manifests...'
          sh 'kubectl apply -f deployment.yml'
          sh 'kubectl apply -f service.yml'
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        script {
          echo 'Getting deployments, services, and pods...'
          sh 'kubectl get deployments -o wide'
          sh 'kubectl get services -o wide'
          sh 'kubectl get pods -o wide'
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

pipeline {
  agent any
  stages {
    stage('Build') {
      parallel {
        stage('Build backend') {
          steps {
            fileExists 'backend/'
            dir(path: 'backend') {
              sh 'npm install'
            }
          }
        }

        stage('Build frontend') {
          steps {
            fileExists 'frontend/site'
            dir(path: 'frontend/site') {
              sh 'npm install'
              sh 'npm build'
            }
          }
        }
      }
    }

    stage('Test') {
      parallel {
        stage('Backend tests') {
          stages {
            stage('Unit Tests') {
              steps {
                dir(path: 'backend') {
                  sh 'npm run test:unit'
                }
              }
            }

            stage('Integration Tests') {
              steps {
                dir(path: 'backend') {
                  sh 'npm run test:integ'
                }
              }
            }
          }
        }
        stage('Frontend Unit Tests') {
            steps {
              dir(path: 'frontend/site') {
                sh 'npm run test:unit'
              }
            }
          }
      }
    }

    stage ('Run Eslint') {
      parallel {
        stage('backend') {
          steps {
            dir(path: 'backend') {
              sh 'npm run eslint'
            }
          }
        }
        stage('frontend') {
          steps {
            dir(path: 'frontend/site') {
              sh 'npm run lint'
            }
          }
        }
      }
    }
    stage('E2E Tests') {
      steps {
        fileExists 'test/'
        dir(path: 'test') {
          sh 'npm install'
          sh 'npm run test'
        }
      }
    }
  }

  environment {
    CI = 'true'
  }
}
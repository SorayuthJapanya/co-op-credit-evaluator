pipeline {
    agent any

    environment {
        COOP_DEPLOY_DIR        = credentials('COOP_DEPLOY_DIR')        // e.g. /opt/coop
        COOP_SERVER_HEALTH_URL = credentials('COOP_SERVER_HEALTH_URL') // e.g. http://localhost:10000
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            agent {
                docker {
                    image 'golang:1.25-alpine'
                    args '-v go-cache:/root/.cache/go-build -v go-mod:/go/pkg/mod'
                    reuseNode true
                }
            }
            steps {
                dir('server') {
                    sh 'go test ./... -v -count=1'
                }
            }
        }

        stage('Test Frontend') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-v pnpm-store:/root/.local/share/pnpm'
                    reuseNode true
                }
            }
            steps {
                dir('client') {
                    sh 'npm install -g pnpm && pnpm install --frozen-lockfile'
                    sh 'pnpm run build'
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh """
                    cd ${COOP_DEPLOY_DIR} &&
                    docker compose build --no-cache &&
                    docker compose up -d --remove-orphans &&
                    docker image prune -f
                """
            }
        }

        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def retries = 10
                    def delay = 10

                    retry(retries) {
                        sleep(delay)
                        def response = sh(
                            script: "curl -sf ${COOP_SERVER_HEALTH_URL}/health -o /dev/null -w '%{http_code}'",
                            returnStdout: true
                        ).trim()

                        if (response != '200') {
                            error("Health check failed — HTTP ${response}")
                        }
                        echo "Health check passed — HTTP ${response}"
                    }
                }
            }
        }

        stage('Verify') {
            when {
                branch 'main'
            }
            steps {
                sh """
                    echo '===== Container Status =====' &&
                    cd ${COOP_DEPLOY_DIR} &&
                    docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded on branch: ${env.BRANCH_NAME}"
        }
        failure {
            echo "Pipeline failed on branch: ${env.BRANCH_NAME}"
        }
        always {
            cleanWs()
        }
    }
}

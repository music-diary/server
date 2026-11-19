# 인프라 설정 안내

이 디렉터리와 루트의 배포 파일은 폐기된 환경의 구조를 설명하기 위해 정리한 자료입니다. 실제 AWS 계정, 네트워크 ID, 연결 주소 및 인증정보를 포함하지 않습니다. 새로운 환경에 적용하려면 리소스와 연결 설정을 별도로 준비해야 합니다.

## 파일별 용도

| 파일 | 용도 |
| --- | --- |
| `../../Dockerfile.develop` | Node.js 20 기반 이미지 빌드, Prisma Client 생성, NestJS 빌드 및 실행 |
| `../../.dockerignore` | 로컬 환경 파일, 비밀 파일, 빌드 결과 등을 Docker 빌드 컨텍스트에서 제외 |
| `../../Dockerrun.aws.json` | Elastic Beanstalk 단일 컨테이너 설정 예시. 이미지 이름을 실제 이미지로 교체해야 함 |
| `../../.ebextensions/01.options.config.example` | ALB, 상태 확인 경로, VPC·서브넷 및 Redis 옵션 예시 |
| `../../.ebextensions/02.elasticache.config.example` | ElastiCache와 서버 보안 그룹 간 접근 설정 예시 |
| `elasticbeanstalk.config.yml.example` | EB CLI 설정 예시. 사용할 경우 `.elasticbeanstalk/config.yml`로 복사하고 환경을 지정 |
| `legacy-stage-dockerrun.json.example` | 과거 다중 컨테이너 v2 설정의 참고용 예시. 기본 배포 경로에 포함하지 않음 |
| `../../ecosystem.config.js` | 빌드된 API를 PM2로 실행하는 대안. 연결 설정은 프로세스 환경에서 전달 |
| `../../Procfile` | Node.js 플랫폼에서 설치·빌드·실행하는 진입점 |
| `../../run.sh` | 컨테이너 내 설치·Prisma Client 생성·빌드·실행용 보조 스크립트 |
| `../../deploy.sh` | 커밋된 HEAD의 Node.js 앱 소스만 `deploy.zip`으로 패키징. AWS 업로드는 수행하지 않음 |

`.example` 확장자의 네트워크 설정은 Elastic Beanstalk가 자동 적용하지 않습니다. 사용할 때는 VPC·서브넷 예시값을 교체하고 `.config` 파일로 준비해야 합니다. 패키징 스크립트는 해당 설정을 포함하지 않으므로, 적용할 설정을 검토한 후 배포 패키지에 별도로 추가해야 합니다.

Redis 보안 그룹은 EB 서버 보안 그룹으로부터의 접근을 허용하는 형태입니다. 퍼블릭·프라이빗 서브넷 구분, NAT, 인증서, DNS, DB 보안 그룹 및 실제 가용 영역 구성은 현재 자료만으로 확정하지 않습니다.

## Node.js 플랫폼용 소스 패키징

관련 소스 변경을 먼저 커밋한 뒤 실행합니다.

```bash
bash deploy.sh
# 기존 파일을 유지하며 다른 경로로 출력
bash deploy.sh /tmp/muda-source.zip
```

이 명령은 작업 트리 대신 커밋된 HEAD에서 지정한 소스 경로만 가져옵니다. 로컬 환경 파일, 이전 `deploy.zip`, 임의의 미추적 파일을 포함하지 않습니다. 기본 출력인 `deploy.zip`은 Git 추적 대상에서 제외합니다. 같은 이름의 파일이 있으면 덮어쓰지 않고 종료합니다.

## Docker 이미지 빌드

```bash
docker build -f Dockerfile.develop -t muda-api:local .
```

컨테이너는 `5000` 포트로 실행하며, 접속 정보는 실행 시 전달해야 합니다. `Dockerrun.aws.json`은 `example/muda:latest`를 실제 이미지 이름으로 바꾼 후 사용합니다. 이미지 레지스트리 업로드와 AWS 배포는 별도 작업입니다.

## 검증 범위

현재 AWS 리소스에 접속하거나 배포하지 않습니다. 예시 설정과 문서는 저장소 기준이며, 신규 환경에서의 네트워크 연결 및 추천 모델 호출 성공은 별도 검증이 필요합니다. `.github/workflows/develop.build.yml`은 체크아웃만 활성화되어 있고 자동 배포는 비활성 상태입니다.

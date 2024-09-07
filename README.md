# Smart Window(IoT) (08/29 ~ 11/04)

## 🌈 개요
신도시가 많이 생겨남에 따라 신축 아파트가 많이 지어지는 추세에서 스마트홈의 일부 기능 중 하나인 스마트 윈도우를 구현하는 것을 목표로 한다.
내부환경 센싱과 위험요소 감지를 통해 집안 환경의 습도와 온도 유해가스 등을 파악하고 자동으로 열리고 닫히는 창문으로 이를 최적의 환경으로 만들어준다. 사용자가 외출 중이어도 집안 내부 환경을 관리하고 사용자에게 실시간으로 모니터링해 줌으로써 사용자에게 편리성과 실용성을 제공한다.

<br>

## 👨🏻‍💻 개발 인원

팀장: 원승현(백엔드)

팀원: 강석훈(프론트)

팀원: 홍동우(아두이노)

팀원: 윤선우(아두이노)

<br>

## 📌 기능 소개

### 💡 회원가입
- 아이디 중복검사를 실시한다.
- 회원가입 시 창문 개폐 장치의 시리얼 번호를 입력하여 기계를 등록한다.
- 메인 화면에 표시 될 창문 이름을 정할 수 있다.
- 창문을 여러 개 등록한 경우 제어할 창문을 선택할 수 있다.

<img width="286" alt="image" src="https://github.com/user-attachments/assets/8f5ab563-33c1-4ac9-a997-353b2493e182">

### 💡 로그인
- 가입 때 사용한 아이디, 비밀번호를 이용하여 로그인을 진행한다.

<img width="272" alt="image" src="https://github.com/user-attachments/assets/6e5a0096-8b52-49d2-ab97-5cd06081174b">

### 💡 아이디 / 비밀번호 찾기
- 창문 개폐 장치의 시리얼 번호로 아이디를 찾을 수 있다.
- 비밀번호 또한 시리얼 번호와 아이디를 이용하여 찾을 수 있다.

<img width="299" alt="image" src="https://github.com/user-attachments/assets/bea7e795-744b-4645-a9a9-99a6f4563593">

### 💡 메인 화면(자동모드)
- 날씨를 확인할 수 있으며 현재 온도와 습도를 확인할 수 있다.
- 가스 감지를 통해 현재 상황을 알 수 있다.
- 모드를 전환할 수 있다.

<img width="311" alt="image" src="https://github.com/user-attachments/assets/2b445ce3-9e4f-40a5-bd84-a4435361aa02">

### 💡 메인 화면(수동모드)
- 창문 개폐 여부를 직접 설정할 수 있다.
- 그 외는 자동모드와 동일하다.

<img width="312" alt="image" src="https://github.com/user-attachments/assets/9a5de28a-7403-4730-9a80-7681f0ba4f3a">

### 💡 창문 등록 및 전환
- 컨트롤할 창문을 전환할 수 있다.
- 새로 관리할 창문을 등록할 수 있다.

<img width="300" alt="image" src="https://github.com/user-attachments/assets/4ffa5615-ed53-4aab-aad1-4c01f0e3581e">

### 💡 설정
- 자동모드 상황에서 창문 개폐 상황을 설정할 수 있다.
- 등록된 창문마다 값을 설정할 수 있다.

<img width="288" alt="image" src="https://github.com/user-attachments/assets/0f2254fc-c64f-4884-a230-044aa119c5af">

## 📊 Rest API 인터페이스
<img src="https://github.com/user-attachments/assets/1a3c3a72-cbbc-451e-910d-253f4d5d5689" width="80%" />

## 💭 시연 영상
### [Smart Window 시연영상](https://www.youtube.com/watch?v=D2RTarXgU6k)

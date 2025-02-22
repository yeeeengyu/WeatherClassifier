package main

import (
	"fmt"
	"log"
	"net/http"
)

// 핸들러 함수 정의
func helloHandler(w http.ResponseWriter, r *http.Request) {
	// 클라이언트로 응답 보내기
	fmt.Fprintf(w, "Hello, World!")
}
func aboutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "핸들러 정의 함수로 진행되는 페이지")
}

func main() {
	// 라우팅 설정
	http.HandleFunc("/", helloHandler)
	http.HandleFunc("/about", aboutHandler)
	// 서버 시작
	fmt.Println("서버가 8080 포트에서 실행 중입니다...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

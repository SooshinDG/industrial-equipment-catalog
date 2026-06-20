# 관리자 업로드 검수용 샘플 파일

실제 DB를 훼손하지 않고 업로드 흐름을 검수하기 위한 샘플입니다.
(실제 비밀키·개인정보 없음)

| 파일 | 용도 | 기대 결과 |
| --- | --- | --- |
| `valid-import.csv` | 정상 | EQ-AC-001 **가격 수정**(10,320,000→10,500,000), TEST-NEW-001 **신규**. 오류 0 → 반영 가능 |
| `error-import.csv` | 오류 | 음수 가격 / product_id 중복 / 잘못된 boolean(`maybe`) / 잘못된 가격(`abc`) / 허용 안 되는 재고 상태 → 반영 차단 |
| `error-missing-column.csv` | 오류 | 필수 컬럼 `stock_status` 누락 → 반영 차단 |

> `valid-import.csv` 로 반영 테스트 후에는 EQ-AC-001 가격을 원복하고 TEST-NEW-001 을
> 삭제(또는 is_active=false)해 원래 40개 상태로 되돌리세요. (docs/ADMIN-UPLOAD.md 참고)

XLSX 검수가 필요하면 위 CSV를 엑셀에서 열어 .xlsx 로 저장해 사용하면 됩니다.

.MODEL SMALL
.STACK 100H

.DATA
num DB 08H                      ; Number to check
count DB 00H                   ; To store count of 1 bits
msg_yes DB 'Number is Power of 2 $'
msg_no  DB 'Number is NOT Power of 2 $'

.CODE
START:
    MOV AX, @DATA               ; Initialize data segment
    MOV DS, AX

    MOV AL, num                 ; Load number into AL
    MOV CL, 08H                 ; Loop counter for 8 bits
    MOV BL, 00H                 ; BL will store count of 1s

CHECK_BIT:
    SHR AL, 1                   ; Shift right by 1 bit
                                ; LSB goes into Carry Flag (CF)

    JNC NEXT_BIT                ; If CF = 0 → bit was 0 → skip count
    INC BL                      ; If CF = 1 → bit was 1 → increment count

NEXT_BIT:
    DEC CL                      ; Decrease bit counter
    JNZ CHECK_BIT               ; Repeat for all 8 bits

    CMP BL, 01H                 ; Check if exactly one 1-bit
    JE POWER                    ; If count = 1 → Power of 2
    JMP NOT_POWER               ; Else → Not power of 2

POWER:
    LEA DX, msg_yes             ; Print "Power of 2"
    MOV AH, 09H
    INT 21H
    JMP EXIT

NOT_POWER:
    LEA DX, msg_no              ; Print "Not Power of 2"
    MOV AH, 09H
    INT 21H

EXIT:
    MOV AH, 4CH                 ; Exit program
    INT 21H

END START

	.section	__TEXT,__text,regular,pure_instructions

	.global _main
_main:
	.cfi_startproc
## bb.0
    pushq	%rbp
    movq	%rsp, %rbp
    subq	$32, %rsp
## bb.1
    leaq	L_.str(%rip), %rax		#  leaq	stringConst(0), var3(int64)
    movq	%rax, %rdi
    callq	_string_create_by_cstr
    movq	%rax, %r10				#  movq	%rax, var4(int64)
    movq	%r10, %r11				#  movq	var4(int64), var0(int64)
    leaq	L_.str.1(%rip), %rsi		#  leaq	stringConst(1), var5(int64)
    movq	%rdi, -8(%rbp)			#  spill	var1
    movq	%rsi, %rdi
    movq	%r11, -16(%rbp)			#  spill	var0
    callq	_string_create_by_cstr
    movq	%rax, %rdx				#  movq	%rax, var6(int64)
    movq	-16(%rbp), %r11			#  reload	var0
    movq	-8(%rbp), %rdi			#  reload	var1
    movq	%rdx, %rdi				#  movq	var6(int64), var1(int64)
    movq	%r11, %rcx				#  movq	var0(int64), var7(int64)
    movq	%r11, %rdi
    movq	%rdi, %rsi
    movq	%rcx, -24(%rbp)			#  spill	var7
    callq	_string_concat
    movq	%rax, %r8				#  movq	%rax, var8(int64)
    movq	-24(%rbp), %rcx			#  reload	var7
    movq	%rcx, %r9				#  movq	var7(int64), var2(int64)
    movq	%r8, %rdi
    callq	_println_s
    addq	$32, %rsp
    popq	%rbp
    retq
	.cfi_endproc

	.section	__TEXT,__cstring,cstring_literals
L_.str:
	.asciz	"Hello"
L_.str.1:
	.asciz	" PlayScript!"

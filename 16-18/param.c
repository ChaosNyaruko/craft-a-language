/*
测试参数传递。
使用make param来构建。
使用./param来运行。
使用gcc -S param.c -o param.s来生成汇编代码。
*/ 

void println(int a);

int foo(int p1, int p2, int p3, int p4, int p5, int p6, int p7, int p8){
    return p1*p2+p3*p4+p5*p6+p7+p8;
}

int main(){
    int a = 10;
    int b = 12;
    println(foo(b,a,3,4,5,6,7,8));
    return 0;
}
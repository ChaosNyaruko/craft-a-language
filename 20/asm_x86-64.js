"use strict";
/**
 * 生成X64机器的指令
 * @version 0.2
 * @author 宫文学
 * @license 木兰开源协议
 * @since 2021-06-27
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileToAsm = exports.AsmGenerator = exports.AsmModule = void 0;
const symbol_1 = require("./symbol");
const ast_1 = require("./ast");
const console_1 = require("console");
const scanner_1 = require("./scanner");
const types_1 = require("./types");
// import {TailAnalyzer, TailAnalysisResult} from './tail';
/**
 * 指令的编码
 */
var OpCode;
(function (OpCode) {
    //不区分字节宽度的指令
    OpCode[OpCode["jmp"] = 0] = "jmp";
    OpCode[OpCode["je"] = 1] = "je";
    OpCode[OpCode["jne"] = 2] = "jne";
    OpCode[OpCode["jle"] = 3] = "jle";
    OpCode[OpCode["jl"] = 4] = "jl";
    OpCode[OpCode["jge"] = 5] = "jge";
    OpCode[OpCode["jg"] = 6] = "jg";
    OpCode[OpCode["sete"] = 20] = "sete";
    OpCode[OpCode["setne"] = 21] = "setne";
    OpCode[OpCode["setl"] = 22] = "setl";
    OpCode[OpCode["setle"] = 23] = "setle";
    OpCode[OpCode["setg"] = 24] = "setg";
    OpCode[OpCode["setge"] = 25] = "setge";
    //8字节指令
    OpCode[OpCode["movq"] = 40] = "movq";
    OpCode[OpCode["addq"] = 41] = "addq";
    OpCode[OpCode["subq"] = 42] = "subq";
    OpCode[OpCode["mulq"] = 43] = "mulq";
    OpCode[OpCode["imulq"] = 44] = "imulq";
    OpCode[OpCode["divq"] = 45] = "divq";
    OpCode[OpCode["idivq"] = 46] = "idivq";
    OpCode[OpCode["negq"] = 47] = "negq";
    OpCode[OpCode["incq"] = 48] = "incq";
    OpCode[OpCode["decq"] = 49] = "decq";
    OpCode[OpCode["xorq"] = 50] = "xorq";
    OpCode[OpCode["orq"] = 51] = "orq";
    OpCode[OpCode["andq"] = 52] = "andq";
    OpCode[OpCode["notq"] = 53] = "notq";
    OpCode[OpCode["leaq"] = 54] = "leaq";
    OpCode[OpCode["callq"] = 55] = "callq";
    OpCode[OpCode["retq"] = 56] = "retq";
    OpCode[OpCode["pushq"] = 57] = "pushq";
    OpCode[OpCode["popq"] = 58] = "popq";
    OpCode[OpCode["cmpq"] = 59] = "cmpq";
    //4字节指令
    OpCode[OpCode["movl"] = 80] = "movl";
    OpCode[OpCode["addl"] = 81] = "addl";
    OpCode[OpCode["subl"] = 82] = "subl";
    OpCode[OpCode["mull"] = 83] = "mull";
    OpCode[OpCode["imull"] = 84] = "imull";
    OpCode[OpCode["divl"] = 85] = "divl";
    OpCode[OpCode["idivl"] = 86] = "idivl";
    OpCode[OpCode["negl"] = 87] = "negl";
    OpCode[OpCode["incl"] = 88] = "incl";
    OpCode[OpCode["decl"] = 89] = "decl";
    OpCode[OpCode["xorl"] = 90] = "xorl";
    OpCode[OpCode["orl"] = 91] = "orl";
    OpCode[OpCode["andl"] = 92] = "andl";
    OpCode[OpCode["notl"] = 93] = "notl";
    OpCode[OpCode["leal"] = 94] = "leal";
    OpCode[OpCode["calll"] = 95] = "calll";
    OpCode[OpCode["retl"] = 96] = "retl";
    OpCode[OpCode["pushl"] = 97] = "pushl";
    OpCode[OpCode["popl"] = 98] = "popl";
    OpCode[OpCode["cmpl"] = 99] = "cmpl";
    //2字节指令
    OpCode[OpCode["movw"] = 120] = "movw";
    OpCode[OpCode["addw"] = 121] = "addw";
    OpCode[OpCode["subw"] = 122] = "subw";
    OpCode[OpCode["mulw"] = 123] = "mulw";
    OpCode[OpCode["imulw"] = 124] = "imulw";
    OpCode[OpCode["divw"] = 125] = "divw";
    OpCode[OpCode["idivw"] = 126] = "idivw";
    OpCode[OpCode["negw"] = 127] = "negw";
    OpCode[OpCode["incw"] = 128] = "incw";
    OpCode[OpCode["decw"] = 129] = "decw";
    OpCode[OpCode["xorw"] = 130] = "xorw";
    OpCode[OpCode["orw"] = 131] = "orw";
    OpCode[OpCode["andw"] = 132] = "andw";
    OpCode[OpCode["notw"] = 133] = "notw";
    OpCode[OpCode["leaw"] = 134] = "leaw";
    OpCode[OpCode["callw"] = 135] = "callw";
    OpCode[OpCode["retw"] = 136] = "retw";
    OpCode[OpCode["pushw"] = 137] = "pushw";
    OpCode[OpCode["popw"] = 138] = "popw";
    OpCode[OpCode["cmpw"] = 139] = "cmpw";
    //单字节指令
    OpCode[OpCode["movb"] = 160] = "movb";
    OpCode[OpCode["addb"] = 161] = "addb";
    OpCode[OpCode["subb"] = 162] = "subb";
    OpCode[OpCode["mulb"] = 163] = "mulb";
    OpCode[OpCode["imulb"] = 164] = "imulb";
    OpCode[OpCode["divb"] = 165] = "divb";
    OpCode[OpCode["idivb"] = 166] = "idivb";
    OpCode[OpCode["negb"] = 167] = "negb";
    OpCode[OpCode["incb"] = 168] = "incb";
    OpCode[OpCode["decb"] = 169] = "decb";
    OpCode[OpCode["xorb"] = 170] = "xorb";
    OpCode[OpCode["orb"] = 171] = "orb";
    OpCode[OpCode["andb"] = 172] = "andb";
    OpCode[OpCode["notb"] = 173] = "notb";
    OpCode[OpCode["leab"] = 174] = "leab";
    OpCode[OpCode["callb"] = 175] = "callb";
    OpCode[OpCode["retb"] = 176] = "retb";
    OpCode[OpCode["pushb"] = 177] = "pushb";
    OpCode[OpCode["popb"] = 178] = "popb";
    OpCode[OpCode["cmpb"] = 179] = "cmpb";
    //伪指令
    OpCode[OpCode["declVar"] = 180] = "declVar";
    OpCode[OpCode["reload"] = 181] = "reload";
})(OpCode || (OpCode = {}));
class OpCodeHelper {
    static isReturn(op) {
        return op == OpCode.retb || op == OpCode.retw || op == OpCode.retl || op == OpCode.retq;
    }
    static isJump(op) {
        return op < 20;
    }
}
/**
 * 指令
 */
class Inst {
    constructor(op, numOprands, comment = null) {
        this.op = op;
        this.numOprands = numOprands;
        this.comment = comment;
    }
    patchComments(str) {
        if (this.comment != null) {
            if (str.length < 11)
                str += "\t\t\t";
            else if (str.length < 19)
                str += "\t\t";
            else if (str.length < 21)
                str += "\t";
            str += (this.comment == null ? "" : "\t\t#  " + this.comment);
        }
        return str;
    }
}
/**
 * 没有操作数的指令
 */
class Inst_0 extends Inst {
    constructor(op, comment = null) {
        super(op, 0, comment);
    }
    toString() {
        let str = OpCode[this.op];
        return this.patchComments(str);
    }
}
/**
 * 有一个操作数的指令
 */
class Inst_1 extends Inst {
    constructor(op, oprand, comment = null) {
        super(op, 1, comment);
        this.oprand = oprand;
    }
    toString() {
        let str = OpCode[this.op] + "\t" + this.oprand.toString();
        return this.patchComments(str);
    }
    static isInst_1(inst) {
        return typeof inst.oprand == 'object';
    }
}
/**
 * 有一个操作数的指令
 */
class Inst_2 extends Inst {
    constructor(op, oprand1, oprand2, comment = null) {
        super(op, 2, comment);
        this.oprand1 = oprand1;
        this.oprand2 = oprand2;
    }
    toString() {
        let str = OpCode[this.op] + "\t" + this.oprand1.toString() + ", " + this.oprand2.toString();
        return this.patchComments(str);
    }
    static isInst_2(inst) {
        return typeof inst.oprand1 == 'object';
    }
}
/**
 * 操作数
 */
class Oprand {
    constructor(kind, value) {
        this.kind = kind;
        this.value = value;
    }
    isSame(oprand1) {
        return this.kind == oprand1.kind && this.value == oprand1.value;
    }
    toString() {
        if (this.kind == OprandKind.bb) {
            return this.value;
        }
        else if (this.kind == OprandKind.label) {
            return this.value;
        }
        else if (this.kind == OprandKind.immediate) {
            return "$" + this.value;
        }
        else if (this.kind == OprandKind.returnSlot) {
            return "returnSlot";
        }
        else if (this.kind == OprandKind.varIndex) {
            return "var" + this.value;
        }
        else {
            return OprandKind[this.kind] + "(" + this.value + ")";
        }
    }
}
class FunctionOprand extends Oprand {
    constructor(funtionName, args, returnType) {
        super(OprandKind.function, funtionName);
        this.returnType = returnType;
        this.args = args;
    }
    toString() {
        return "_" + this.value;
    }
}
/**
 * 操作数的类型
 */
var OprandKind;
(function (OprandKind) {
    //抽象度较高的操作数
    OprandKind[OprandKind["varIndex"] = 0] = "varIndex";
    OprandKind[OprandKind["returnSlot"] = 1] = "returnSlot";
    OprandKind[OprandKind["bb"] = 2] = "bb";
    OprandKind[OprandKind["function"] = 3] = "function";
    OprandKind[OprandKind["stringConst"] = 4] = "stringConst";
    //抽象度较低的操作数
    OprandKind[OprandKind["register"] = 5] = "register";
    OprandKind[OprandKind["memory"] = 6] = "memory";
    OprandKind[OprandKind["immediate"] = 7] = "immediate";
    OprandKind[OprandKind["label"] = 8] = "label";
    //cmp指令的结果，是设置寄存器的标志位
    //后面可以根据flag和比较操作符的类型，来确定后续要生成的代码
    OprandKind[OprandKind["flag"] = 9] = "flag";
})(OprandKind || (OprandKind = {}));
/**
 * 基本块
 */
class BasicBlock {
    constructor() {
        this.insts = []; //基本块内的指令
        this.funIndex = -1; //函数编号
        this.bbIndex = -1; //基本块的编号。在Lower的时候才正式编号，去除空块。
        this.isDestination = false; //有其他块跳转到该块。
    }
    getName() {
        if (this.bbIndex != -1 && this.funIndex != -1) {
            return "LBB" + this.funIndex + "_" + this.bbIndex;
        }
        else if (this.bbIndex != -1) {
            return "LBB" + this.bbIndex;
        }
        else {
            return "LBB";
        }
    }
    toString() {
        let str;
        if (this.isDestination) {
            str = this.getName() + ":\n";
        }
        else {
            str = "## bb." + this.bbIndex + "\n";
        }
        for (let inst of this.insts) {
            str += "    " + inst.toString() + "\n";
        }
        return str;
    }
}
/**
 * 用Asm表示的一个模块。
 * 可以输出成为asm文件。
 */
class AsmModule {
    constructor() {
        //每个函数对应的指令数组
        this.fun2Code = new Map();
        //每个函数的变量数，包括参数、本地变量和临时变量
        this.numTotalVars = new Map();
        //是否是叶子函数
        this.isLeafFunction = new Map();
        //字符串常量
        this.stringConsts = [];
    }
    /**
     * 输出代表该模块的asm文件的字符串。
     */
    toString() {
        let str = "    .section	__TEXT,__text,regular,pure_instructions\n"; //伪指令：一个文本的section
        for (let fun of this.fun2Code.keys()) {
            let funName = "_" + fun.name;
            str += "\n    .global " + funName + "\n"; //添加伪指令
            str += funName + ":\n";
            str += "    .cfi_startproc\n";
            let bbs = this.fun2Code.get(fun);
            for (let bb of bbs) {
                str += bb.toString();
            }
            str += "    .cfi_endproc\n";
        }
        return str;
    }
}
exports.AsmModule = AsmModule;
/**
 * AsmGenerator需要用到的状态变量
 */
class TempStates {
    constructor() {
        //当前的函数，用于查询本地变量的下标
        this.functionSym = null;
        //当前函数生成的指令
        this.bbs = [];
        //下一个临时变量的下标
        this.nextTempVarIndex = 0;
        //每个表达式节点对应的临时变量的索引
        this.tempVarMap = new Map();
        //主要用于判断当前的Unary是一个表达式的一部分，还是独立的一个语句
        this.inExpression = false;
        //保存一元后缀运算符对应的指令。
        this.postfixUnaryInst = null;
        //当前的BasicBlock编号
        this.blockIndex = 0;
    }
}
/**
 * 汇编代码生成程序。
 * 这是一个比较幼稚的算法，使用了幼稚的寄存器分配算法，但已经尽量争取多使用寄存器，对于简单的函数已经能生成性能不错的代码。
 * 算法特点：
 * 1.先是尽力使用寄存器，寄存器用光以后就用栈桢；
 * 2.对于表达式，尽量复用寄存器来表示临时变量。
 */
class AsmGenerator extends ast_1.AstVisitor {
    constructor() {
        super(...arguments);
        //编译后的结果
        this.asmModule = null;
        //用来存放返回值的位置
        this.returnSlot = new Oprand(OprandKind.returnSlot, -1);
        //一些状态变量
        this.s = new TempStates();
    }
    /**
     * 分配一个临时变量的下标。尽量复用已经死掉的临时变量
     */
    allocateTempVar() {
        let varIndex = this.s.nextTempVarIndex++;
        let oprand = new Oprand(OprandKind.varIndex, varIndex);
        //这里要添加一个变量声明
        this.getCurrentBB().insts.push(new Inst_1(OpCode.declVar, oprand));
        return oprand;
    }
    isTempVar(oprand) {
        if (this.s.functionSym != null) {
            return oprand.kind == OprandKind.varIndex &&
                oprand.value >= this.s.functionSym.vars.length;
        }
        else {
            return false;
        }
    }
    /**
     * 如果操作数不同，则生成mov指令；否则，可以减少一次拷贝。
     * @param src
     * @param dest
     */
    movIfNotSame(src, dest) {
        if (!src.isSame(dest)) {
            this.getCurrentBB().insts.push(new Inst_2(OpCode.movl, src, dest));
        }
    }
    getCurrentBB() {
        return this.s.bbs[this.s.bbs.length - 1];
    }
    newBlock() {
        let bb = new BasicBlock();
        bb.bbIndex = this.s.blockIndex++;
        this.s.bbs.push(bb);
        return bb;
    }
    /**
     * 主函数
     * @param prog
     */
    visitProg(prog) {
        var _a, _b;
        //设置一些状态变量
        this.asmModule = new AsmModule();
        this.s.functionSym = prog.sym;
        this.s.nextTempVarIndex = this.s.functionSym.vars.length;
        //创建新的基本块
        this.newBlock();
        //遍历AST
        this.visitBlock(prog);
        (_a = this.asmModule) === null || _a === void 0 ? void 0 : _a.fun2Code.set(this.s.functionSym, this.s.bbs);
        (_b = this.asmModule) === null || _b === void 0 ? void 0 : _b.numTotalVars.set(this.s.functionSym, this.s.nextTempVarIndex);
        //重新设置状态变量
        this.s = new TempStates();
        return this.asmModule;
    }
    visitFunctionDecl(functionDecl) {
        var _a, _b, _c;
        //保存原来的状态信息
        let s = this.s;
        //新建立状态信息
        this.s = new TempStates();
        this.s.functionSym = functionDecl.sym;
        this.s.nextTempVarIndex = this.s.functionSym.vars.length;
        //计算当前函数是不是叶子函数
        //先设置成叶子变量。如果遇到函数调用，则设置为false。
        (_a = this.asmModule) === null || _a === void 0 ? void 0 : _a.isLeafFunction.set(this.s.functionSym, true);
        //创建新的基本块
        this.newBlock();
        //生成代码
        this.visitBlock(functionDecl.body);
        //保存生成的代码
        (_b = this.asmModule) === null || _b === void 0 ? void 0 : _b.fun2Code.set(this.s.functionSym, this.s.bbs);
        (_c = this.asmModule) === null || _c === void 0 ? void 0 : _c.numTotalVars.set(this.s.functionSym, this.s.nextTempVarIndex);
        //恢复原来的状态信息
        this.s = s;
    }
    /**
     * 把返回值mov到指定的寄存器。
     * 这里并不生成ret指令，而是在程序的尾声中处理。
     * @param returnStatement
     */
    visitReturnStatement(returnStatement) {
        if (returnStatement.exp != null) {
            let ret = this.visit(returnStatement.exp);
            //把返回值赋给相应的寄存器
            this.movIfNotSame(ret, this.returnSlot);
        }
        // this.getCurrentBB().insts.push(new Inst_0(OpCode.retl));
    }
    visitIfStatement(ifStmt) {
        //条件
        let bbCondition = this.getCurrentBB();
        let compOprand = this.visit(ifStmt.condition);
        //if块
        let bbIfBlcok = this.newBlock();
        this.visit(ifStmt.stmt);
        //else块
        let bbElseBlock = null;
        if (ifStmt.elseStmt != null) {
            bbElseBlock = this.newBlock();
            this.visit(ifStmt.elseStmt);
        }
        //最后，要新建一个基本块,用于If后面的语句。
        let bbFollowing = this.newBlock();
        //为bbCondition添加跳转语句
        let op = this.getJumpOpCode(compOprand);
        let instConditionJump;
        if (bbElseBlock != null) {
            //跳转到else块
            instConditionJump = new Inst_1(op, new Oprand(OprandKind.bb, bbElseBlock));
        }
        else {
            //跳转到if之后的块
            instConditionJump = new Inst_1(op, new Oprand(OprandKind.bb, bbFollowing));
        }
        bbCondition.insts.push(instConditionJump);
        //为bbIfBlock添加跳转语句
        if (bbElseBlock != null) { //如果没有else块，就不需要添加跳转了。
            let instIfBlockJump = new Inst_1(OpCode.jmp, new Oprand(OprandKind.bb, bbFollowing));
            bbIfBlcok.insts.push(instIfBlockJump);
        }
    }
    /**
     * 根据条件表达式的操作符，确定该采用的跳转指令。用于if语句和for循环等中。
     * @param compOprand
     */
    getJumpOpCode(compOprand) {
        let op = OpCode.jmp;
        if (compOprand.value == scanner_1.Op.G) {
            op = OpCode.jg;
        }
        else if (compOprand.value == scanner_1.Op.GE) {
            op = OpCode.jge;
        }
        else if (compOprand.value == scanner_1.Op.L) {
            op = OpCode.jl;
        }
        else if (compOprand.value == scanner_1.Op.LE) {
            op = OpCode.jle;
        }
        else if (compOprand.value == scanner_1.Op.EQ) {
            op = OpCode.je;
        }
        else if (compOprand.value == scanner_1.Op.NE) {
            op = OpCode.jne;
        }
        else {
            console.log("Unsupported compare operand in conditional expression: " + compOprand.value);
        }
        return op;
    }
    visitForStatement(forStmt) {
        //初始化，放到前一个BasicBlock中
        if (forStmt.init != null) {
            this.visit(forStmt.init);
        }
        //condition
        let bbCondition = this.newBlock();
        let compOprand = null;
        if (forStmt.condition != null) {
            compOprand = this.visit(forStmt.condition);
        }
        //循环体
        let bbBody = this.newBlock();
        this.visit(forStmt.stmt);
        //增长语句，跟循环体在同一个BasicBlock中
        if (forStmt.increment != null) {
            this.visit(forStmt.increment);
        }
        //最后，要新建一个基本块,用于If后面的语句。
        let bbFollowing = this.newBlock();
        //为bbCondition添加跳转语句
        if (compOprand != null) { //如果没有循环条件，就会直接落到循环体中
            let op = this.getJumpOpCode(compOprand);
            let instConditionJump = new Inst_1(op, new Oprand(OprandKind.bb, bbFollowing));
            bbCondition.insts.push(instConditionJump);
        }
        //为循环体添加跳转语句
        let bbDest;
        if (compOprand != null) {
            bbDest = bbCondition; //去执行循环条件
        }
        else { //如果没有循环条件，就直接回到循环体的第一句
            bbDest = bbBody;
        }
        let instBodyJump = new Inst_1(OpCode.jmp, new Oprand(OprandKind.bb, bbDest));
        bbBody.insts.push(instBodyJump);
    }
    visitVariableDecl(variableDecl) {
        if (variableDecl.init != null && this.s.functionSym != null) {
            let right = this.visit(variableDecl.init);
            let varIndex = this.s.functionSym.vars.indexOf(variableDecl.sym);
            let left = new Oprand(OprandKind.varIndex, varIndex);
            //插入一条抽象指令，代表这里声明了一个变量
            this.getCurrentBB().insts.push(new Inst_1(OpCode.declVar, left));
            this.movIfNotSame(right, left);
            return left;
        }
    }
    /**
     * 二元表达式
     * @param bi
     */
    visitBinary(bi) {
        this.s.inExpression = true;
        let insts = this.getCurrentBB().insts;
        //左子树返回的操作数
        let left = this.visit(bi.exp1);
        //右子树
        let right = this.visit(bi.exp2);
        console_1.assert(typeof left == 'object', "表达式没有返回Oprand。");
        console_1.assert(typeof right == 'object', "表达式没有返回Oprand。");
        //计算出一个目标操作数
        let dest = left;
        if (bi.op == scanner_1.Op.Plus || bi.op == scanner_1.Op.Minus || bi.op == scanner_1.Op.Multiply || bi.op == scanner_1.Op.Divide) {
            if (!this.isTempVar(dest)) {
                dest = this.allocateTempVar();
                insts.push(new Inst_2(OpCode.movl, left, dest));
            }
        }
        //生成指令
        //todo 有问题的地方
        switch (bi.op) {
            case scanner_1.Op.Plus: //'+'
                if (bi.theType === types_1.SysTypes.String) { //字符串加
                    let args = [];
                    args.push(left);
                    args.push(right);
                    this.callIntrinsics("string_concat", args);
                }
                else {
                    // this.movIfNotSame(left,dest);
                    insts.push(new Inst_2(OpCode.addl, right, dest));
                }
                break;
            case scanner_1.Op.Minus: //'-'
                // this.movIfNotSame(left,dest);
                insts.push(new Inst_2(OpCode.subl, right, dest));
                break;
            case scanner_1.Op.Multiply: //'*'
                // this.movIfNotSame(left,dest);
                insts.push(new Inst_2(OpCode.imull, right, dest));
                break;
            case scanner_1.Op.Divide: //'/'
                // this.movIfNotSame(left,dest);
                insts.push(new Inst_2(OpCode.idivl, right, dest));
                break;
            case scanner_1.Op.Assign: //'='
                this.movIfNotSame(right, dest);
                break;
            case scanner_1.Op.G:
            case scanner_1.Op.L:
            case scanner_1.Op.GE:
            case scanner_1.Op.LE:
            case scanner_1.Op.EQ:
            case scanner_1.Op.NE:
                insts.push(new Inst_2(OpCode.cmpl, right, dest));
                dest = new Oprand(OprandKind.flag, this.getOpsiteOp(bi.op));
                break;
            default:
                console.log("Unsupported OpCode in AsmGenerator.visitBinary: " + scanner_1.Op[bi.op]);
        }
        this.s.inExpression = false;
        return dest;
    }
    getOpsiteOp(op) {
        let newOp = op;
        switch (op) {
            case scanner_1.Op.G:
                newOp = scanner_1.Op.LE;
                break;
            case scanner_1.Op.L:
                newOp = scanner_1.Op.GE;
                break;
            case scanner_1.Op.GE:
                newOp = scanner_1.Op.L;
                break;
            case scanner_1.Op.LE:
                newOp = scanner_1.Op.G;
                break;
            case scanner_1.Op.EQ:
                newOp = scanner_1.Op.NE;
                break;
            case scanner_1.Op.NE:
                newOp = scanner_1.Op.EQ;
                break;
            default:
                console.log("Unsupport Op '" + scanner_1.Op[op] + "' in getOpsiteOpCode.");
        }
        return newOp;
    }
    /**
     * 为一元运算符生成指令
     * 对于++或--这样的一元运算，只能是右值。如果是后缀表达式，需要在前一条指令之后，再把其值改一下。
     * 所以，存个临时状态信息
     * @param u
     */
    visitUnary(u) {
        let insts = this.getCurrentBB().insts;
        let oprand = this.visit(u.exp);
        //用作返回值的Oprand
        let result = oprand;
        //++和--
        if (u.op == scanner_1.Op.Inc || u.op == scanner_1.Op.Dec) {
            let tempVar = this.allocateTempVar();
            insts.push(new Inst_2(OpCode.movl, oprand, tempVar));
            if (u.isPrefix) { //前缀运算符
                result = tempVar;
            }
            else { //后缀运算符
                //把当前操作数放入一个临时变量作为返回值
                result = this.allocateTempVar();
                insts.push(new Inst_2(OpCode.movl, oprand, result));
            }
            //做+1或-1的运算
            let opCode = u.op == scanner_1.Op.Inc ? OpCode.addl : OpCode.subl;
            insts.push(new Inst_2(opCode, new Oprand(OprandKind.immediate, 1), tempVar));
            insts.push(new Inst_2(OpCode.movl, tempVar, oprand));
        }
        //+
        else if (u.op == scanner_1.Op.Plus) {
            result = oprand;
        }
        //-
        else if (u.op == scanner_1.Op.Minus) {
            let tempVar = this.allocateTempVar();
            //用0减去当前值
            insts.push(new Inst_2(OpCode.movl, new Oprand(OprandKind.immediate, 0), tempVar));
            insts.push(new Inst_2(OpCode.subl, oprand, tempVar));
            result = tempVar;
        }
        return result;
    }
    visitExpressionStatement(stmt) {
        //先去为表达式生成指令
        super.visitExpressionStatement(stmt);
    }
    visitVariable(variable) {
        if (this.s.functionSym != null && variable.sym != null) {
            return new Oprand(OprandKind.varIndex, this.s.functionSym.vars.indexOf(variable.sym));
        }
    }
    visitIntegerLiteral(integerLiteral) {
        return new Oprand(OprandKind.immediate, integerLiteral.value);
    }
    visitStringLiteral(stringLiteral) {
        //加到常数表里
        if (this.asmModule != null) {
            let strIndex = this.asmModule.stringConsts.indexOf(stringLiteral.value);
            if (strIndex == -1) {
                this.asmModule.stringConsts.push(stringLiteral.value);
                strIndex = this.asmModule.stringConsts.length - 1;
            }
            //调用一个内置函数来创建PlayString
            let args = [];
            args.push(new Oprand(OprandKind.stringConst, strIndex));
            return this.callIntrinsics("string_create_by_str", args);
        }
    }
    callIntrinsics(intrinsic, args) {
        let insts = this.getCurrentBB().insts;
        let functionSym = symbol_1.intrinsics.get("string_create_by_str");
        let functionType = functionSym.theType;
        insts.push(new Inst_1(OpCode.callq, new FunctionOprand("string_create_by_str", args, functionType.returnType)));
        //把结果放到一个新的临时变量里
        if (functionType.returnType != types_1.SysTypes.Void) { //函数有返回值时
            let dest = this.allocateTempVar();
            insts.push(new Inst_2(OpCode.movl, this.returnSlot, dest));
            return dest;
        }
    }
    /**
     * 为函数调用生成指令
     * 计算每个参数，并设置参数
     * @param functionCall
     */
    visitFunctionCall(functionCall) {
        var _a;
        //当前函数不是叶子函数
        (_a = this.asmModule) === null || _a === void 0 ? void 0 : _a.isLeafFunction.set(this.s.functionSym, false);
        let insts = this.getCurrentBB().insts;
        let args = [];
        for (let arg of functionCall.arguments) {
            let oprand = this.visit(arg);
            args.push(oprand);
        }
        let functionSym = functionCall.sym;
        let functionType = functionSym.theType;
        insts.push(new Inst_1(OpCode.callq, new FunctionOprand(functionCall.name, args, functionType.returnType)));
        //把结果放到一个新的临时变量里
        let dest = undefined;
        if (functionType.returnType != types_1.SysTypes.Void) { //函数有返回值时
            dest = this.allocateTempVar();
            insts.push(new Inst_2(OpCode.movl, this.returnSlot, dest));
        }
        //调用函数完毕以后，要重新装载被Spilled的变量
        //这个动作要在获取返回值之后
        insts.push(new Inst_0(OpCode.reload));
        return dest;
    }
}
exports.AsmGenerator = AsmGenerator;
///////////////////////////////////////////////////////////////////////////
//Lower
class Register extends Oprand {
    constructor(registerName, bits = 32) {
        super(OprandKind.register, registerName);
        this.bits = 32; //寄存器的位数
        this.bits = bits;
    }
    toString() {
        return "%" + this.value;
    }
}
//可供分配的寄存器的数量
//16个通用寄存器中，扣除rbp和rsp，然后保留一个寄存器，用来作为与内存变量交换的区域。
Register.numAvailableRegs = 13;
//32位寄存器
//参数用的寄存器，当然也要由caller保护
Register.edi = new Register("edi");
Register.esi = new Register("esi");
Register.edx = new Register("edx");
Register.ecx = new Register("ecx");
Register.r8d = new Register("r8d");
Register.r9d = new Register("r9d");
//通用寄存器:caller（调用者）负责保护
Register.r10d = new Register("r10d");
Register.r11d = new Register("r11d");
//返回值，也由Caller保护
Register.eax = new Register("eax");
//通用寄存器:callee（调用者）负责保护
Register.ebx = new Register("ebx");
Register.r12d = new Register("r12d");
Register.r13d = new Register("r13d");
Register.r14d = new Register("r14d");
Register.r15d = new Register("r15d");
//栈顶和栈底
Register.esp = new Register("esp");
Register.ebp = new Register("ebp");
//32位的可供分配的寄存器
Register.registers32 = [
    Register.r10d,
    Register.r11d,
    Register.edi,
    Register.esi,
    Register.edx,
    Register.ecx,
    Register.r8d,
    Register.r9d,
    Register.eax,
    Register.ebx,
    Register.r12d,
    Register.r13d,
    Register.r14d,
    Register.r15d,
];
//用于传参的寄存器
Register.paramRegisters32 = [
    Register.edi,
    Register.esi,
    Register.edx,
    Register.ecx,
    Register.r8d,
    Register.r9d,
];
//Callee保护的寄存器
Register.calleeProtected32 = [
    Register.ebx,
    Register.r12d,
    Register.r13d,
    Register.r14d,
    Register.r15d,
];
//Caller保护的寄存器
Register.callerProtected32 = [
    Register.edi,
    Register.esi,
    Register.edx,
    Register.ecx,
    Register.r8d,
    Register.r9d,
    Register.r10d,
    Register.r11d,
    Register.eax,
];
//64位寄存器
//参数用的寄存器，当然也要由caller保护
Register.rdi = new Register("rdi", 64);
Register.rsi = new Register("rsi", 64);
Register.rdx = new Register("rdx", 64);
Register.rcx = new Register("rcx", 64);
Register.r8 = new Register("r8", 64);
Register.r9 = new Register("r9", 64);
//通用寄存器:caller（调用者）负责保护
Register.r10 = new Register("r10", 64);
Register.r11 = new Register("r11", 64);
//返回值，也由Caller保护
Register.rax = new Register("rax", 64);
//通用寄存器:callee（调用者）负责保护
Register.rbx = new Register("rbx", 64);
Register.r12 = new Register("r12", 64);
Register.r13 = new Register("r13", 64);
Register.r14 = new Register("r14", 64);
Register.r15 = new Register("r15", 64);
//栈顶和栈底
Register.rsp = new Register("rsp", 64);
Register.rbp = new Register("rbp", 64);
//64位的可供分配的寄存器
Register.registers64 = [
    Register.rax,
    Register.r10,
    Register.r11,
    Register.rdi,
    Register.rsi,
    Register.rdx,
    Register.rcx,
    Register.r8,
    Register.r9,
    Register.rbx,
    Register.r12,
    Register.r13,
    Register.r14,
    Register.r15,
];
//Callee保护的寄存器
Register.calleeProtected64 = [
    Register.rbx,
    Register.r12,
    Register.r13,
    Register.r14,
    Register.r15,
];
//Caller保护的寄存器
Register.callerProtected64 = [
    Register.rdi,
    Register.rsi,
    Register.rdx,
    Register.rcx,
    Register.r8,
    Register.r9,
    Register.r10,
    Register.r11,
    Register.rax,
];
/**
 * 内存寻址
 * 这是个简化的版本，只支持基于寄存器的偏移量
 * 后面根据需要再扩展。
 */
class MemAddress extends Oprand {
    constructor(register, offset) {
        super(OprandKind.memory, 'undefined');
        this.register = register;
        this.offset = offset;
    }
    toString() {
        //输出结果类似于：8(%rbp)
        //如果offset为0，那么不显示，即：(%rbp)
        return (this.offset == 0 ? "" : this.offset) + "(" + this.register.toString() + ")";
    }
}
/**
 * 对AsmModule做Lower处理。
 * 1.把寄存器改成具体的物理寄存器
 * 2.把本地变量也换算成具体的内存地址
 * 3.把抽象的指令转换成具体的指令
 * 4.计算标签名称
 * 5.添加序曲和尾声
 * 6.内存对齐
 * @param asmModule
 */
class Lower {
    constructor(asmModule, livenessResult) {
        //当前函数使用到的那些Callee保护的寄存器
        this.usedCalleeProtectedRegs = [];
        //当前函数的参数数量
        this.numParams = 0;
        //保存已经被Lower的Oprand，用于提高效率
        this.loweredVars = new Map();
        //需要在栈里保存的为函数传参（超过6个之后的参数）保留的空间，每个参数占8个字节
        this.numArgsOnStack = 0;
        //rsp应该移动的量。这个量再加8就是该函数所对应的栈桢的大小，其中8是callq指令所压入的返回地址
        this.rspOffset = 0;
        //是否使用RedZone，也就是栈顶之外的128个字节
        this.canUseRedZone = false;
        //预留的寄存器。
        //主要用于在调用函数前，保护起那些马上就要用到的寄存器，不再分配给其他变量。
        this.reservedRegisters = [];
        //spill的register在内存中的位置。
        this.spillOffset = 0;
        //被spill的变量
        //key是varIndex，value是内存地址
        this.spilledVars2Address = new Map();
        //key是varIndex，value是原来的寄存器
        this.spilledVars2Reg = new Map();
        this.asmModule = asmModule;
        this.livenessResult = livenessResult;
    }
    lowerModule() {
        let newFun2Code = new Map();
        let funIndex = 0;
        for (let fun of this.asmModule.fun2Code.keys()) {
            let bbs = this.asmModule.fun2Code.get(fun);
            let newBBs = this.lowerFunction(fun, bbs, funIndex++);
            newFun2Code.set(fun, newBBs);
        }
        this.asmModule.fun2Code = newFun2Code;
    }
    lowerFunction(functionSym, bbs, funIndex) {
        //初始化一些状态变量
        this.initStates(functionSym);
        //Lower参数
        this.lowerParams();
        //lower每个BasicBlock中的指令
        for (let i = 0; i < bbs.length; i++) {
            let bb = bbs[i];
            let newInsts = [];
            this.lowerBB(bb, newInsts);
            bb.insts = newInsts;
        }
        //是否可以使用RedZone
        //需要是叶子函数，并且对栈外空间的使用量小于128个字节，也就是32个整数
        let isLeafFunction = this.asmModule.isLeafFunction.get(functionSym);
        if (isLeafFunction) {
            let bytes = this.spillOffset + this.numArgsOnStack * 8 + this.usedCalleeProtectedRegs.length * 8;
            this.canUseRedZone = bytes < 128;
        }
        //添加序曲
        bbs[0].insts = this.addPrologue(bbs[0].insts);
        //添加尾声
        this.addEpilogue(bbs[bbs.length - 1].insts);
        //基本块的标签和跳转指令。
        let newBBs = this.lowerBBLabelAndJumps(bbs, funIndex);
        //把spilledVars中的地址修改一下，加上CalleeProtectedReg所占的空间
        if (this.usedCalleeProtectedRegs.length > 0) {
            let offset = this.usedCalleeProtectedRegs.length * 8;
            for (let address of this.spilledVars2Address.values()) {
                let oldValue = address.value;
                address.value = oldValue + offset;
            }
        }
        // console.log(this);   //打印一下，看看状态变量是否对。
        return newBBs;
    }
    lowerParams() {
        for (let i = 0; i < this.numParams; i++) {
            if (i < 6) {
                let reg = Register.paramRegisters32[i];
                this.assignRegToVar(i, reg);
            }
            else {
                //从Caller的栈里访问参数
                let offset = (i - 6) * 8 + 16; //+16是因为有一个callq压入的返回地址，一个pushq rbp又加了8个字节
                let oprand = new MemAddress(Register.rbp, offset);
                this.loweredVars.set(i, oprand);
            }
        }
    }
    /**
     * 初始化当前函数的一些状态变量，在算法中会用到它们
     * @param functionSym
     */
    initStates(functionSym) {
        this.usedCalleeProtectedRegs = [];
        this.numParams = functionSym.getNumParams();
        this.numArgsOnStack = 0;
        this.rspOffset = 0;
        this.loweredVars.clear();
        this.spillOffset = 0;
        this.spilledVars2Address.clear();
        this.spilledVars2Reg.clear();
        this.reservedRegisters = [];
        this.canUseRedZone = false;
    }
    //添加序曲
    addPrologue(insts) {
        let newInsts = [];
        //保存rbp的值
        newInsts.push(new Inst_1(OpCode.pushq, Register.rbp));
        //把原来的栈顶保存到rbp,成为现在的栈底
        newInsts.push(new Inst_2(OpCode.movq, Register.rsp, Register.rbp));
        //计算栈顶指针需要移动多少位置
        //要保证栈桢16字节对齐
        if (!this.canUseRedZone) {
            this.rspOffset = this.spillOffset + this.numArgsOnStack * 8;
            //当前占用的栈空间，还要加上Callee保护的寄存器占据的空间
            let rem = (this.rspOffset + this.usedCalleeProtectedRegs.length * 8) % 16;
            if (rem == 8) {
                this.rspOffset += 8;
            }
            else if (rem == 4) {
                this.rspOffset += 12;
            }
            else if (rem == 12) {
                this.rspOffset += 4;
            }
            if (this.rspOffset > 0)
                newInsts.push(new Inst_2(OpCode.subq, new Oprand(OprandKind.immediate, this.rspOffset), Register.rsp));
        }
        //保存Callee负责保护的寄存器
        this.saveCalleeProtectedRegs(newInsts);
        //合并原来的指令
        newInsts = newInsts.concat(insts);
        return newInsts;
    }
    //添加尾声
    addEpilogue(newInsts) {
        //恢复Callee负责保护的寄存器
        this.restoreCalleeProtectedRegs(newInsts);
        //缩小栈桢
        if (!this.canUseRedZone && this.rspOffset > 0) {
            newInsts.push(new Inst_2(OpCode.addq, new Oprand(OprandKind.immediate, this.rspOffset), Register.rsp));
        }
        //恢复rbp的值
        newInsts.push(new Inst_1(OpCode.popq, Register.rbp));
        //返回
        newInsts.push(new Inst_0(OpCode.retq));
    }
    //去除空的BasicBlock，给BasicBlock编号，把jump指令也lower
    lowerBBLabelAndJumps(bbs, funIndex) {
        let newBBs = [];
        let bbIndex = 0;
        //去除空的BasicBlock，并给BasicBlock编号
        for (let i = 0; i < bbs.length; i++) {
            let bb = bbs[i];
            //如果是空的BasicBlock，就跳过
            if (bb.insts.length > 0) {
                bb.funIndex = funIndex;
                bb.bbIndex = bbIndex++;
                newBBs.push(bb);
            }
            else {
                //如果有一个BasicBlock指向该block，那么就指向下一个block;
                for (let j = 0; j < bbs.length; j++) {
                    let lastInst = bbs[j].insts[bbs[j].insts.length - 1];
                    if (OpCodeHelper.isJump(lastInst.op)) {
                        let jumpInst = lastInst;
                        let destBB = jumpInst.oprand.value;
                        if (destBB == bb) {
                            jumpInst.oprand.value = bbs[i + 1];
                        }
                    }
                }
            }
        }
        //把jump指令的操作数lower一下,从BasicBlock变到标签
        for (let i = 0; i < newBBs.length; i++) {
            let insts = newBBs[i].insts;
            let lastInst = insts[insts.length - 1];
            if (OpCodeHelper.isJump(lastInst.op)) { //jump指令
                let jumpInst = lastInst;
                let bbDest = jumpInst.oprand.value;
                jumpInst.oprand.value = bbDest.getName();
                jumpInst.oprand.kind = OprandKind.label;
                bbDest.isDestination = true; //有其他block跳到这个block
            }
        }
        return newBBs;
    }
    /**
     * Lower指令
     * @param insts
     * @param newInsts
     */
    lowerBB(bb, newInsts) {
        let insts = bb.insts;
        let varsToSpill = [];
        for (let i = 0; i < insts.length; i++) {
            let inst = insts[i];
            let liveVars = this.livenessResult.liveVars.get(inst);
            //两个操作数
            if (Inst_2.isInst_2(inst)) {
                let inst_2 = inst;
                inst_2.comment = inst_2.toString();
                inst_2.oprand1 = this.lowerOprand(liveVars, inst_2.oprand1, newInsts);
                inst_2.oprand2 = this.lowerOprand(liveVars, inst_2.oprand2, newInsts);
                //对mov再做一次优化
                if (!(inst_2.op == OpCode.movl && inst_2.oprand1 == inst_2.oprand2)) {
                    newInsts.push(inst_2);
                }
            }
            //1个操作数
            else if (Inst_1.isInst_1(inst)) {
                let inst_1 = inst;
                inst_1.oprand = this.lowerOprand(liveVars, inst_1.oprand, newInsts);
                if (inst.op != OpCode.declVar) { //忽略变量声明的伪指令。
                    //处理函数调用
                    //函数调用前后，要设置参数；
                    if (inst_1.op == OpCode.callq) {
                        let liveVarsAfterCall = (i == insts.length - 1)
                            ? this.livenessResult.initialVars.get(bb)
                            : this.livenessResult.liveVars.get(insts[i + 1]);
                        varsToSpill = this.lowerFunctionCall(inst_1, liveVars, liveVarsAfterCall, newInsts);
                    }
                    else {
                        newInsts.push(inst_1);
                    }
                }
            }
            //没有操作数
            else {
                if (inst.op == OpCode.reload) {
                    //如果是最后一条指令，或者下一条指令就是return，那么就不用reload了
                    if (i != insts.length - 1 && !OpCodeHelper.isReturn(insts[i + 1].op)) {
                        for (let i = 0; i < varsToSpill.length; i++) {
                            let varIndex = varsToSpill[i];
                            this.reloadVar(varIndex, newInsts);
                        }
                        varsToSpill = [];
                    }
                }
                else {
                    newInsts.push(inst);
                }
            }
        }
    }
    /**
     * 处理函数调用。
     * 需要保存Caller负责保护的寄存器。
     * @param inst_1
     * @param liveVars          函数调用时的活跃变量
     * @param liveVarsAfterCall 函数调用之后的活跃变量
     * @param newInsts
     */
    lowerFunctionCall(inst_1, liveVars, liveVarsAfterCall, newInsts) {
        let functionOprand = inst_1.oprand;
        let args = functionOprand.args;
        //需要在栈桢里为传参保留的空间
        let numArgs = args.length;
        if (numArgs > 6 && numArgs - 6 > this.numArgsOnStack) {
            this.numArgsOnStack = numArgs - 6;
        }
        //保存Caller负责保护的寄存器
        let varsToSpill = [];
        let regsToSpill = [];
        //保护那些在函数调用之后，仍然会被使用使用的CallerProtected寄存器
        //将这些位置预留下来
        for (let varIndex of liveVarsAfterCall) {
            let oprand = this.loweredVars.get(varIndex);
            if (oprand.kind == OprandKind.register &&
                Register.callerProtected32.indexOf(oprand) != -1) {
                varsToSpill.push(varIndex);
                regsToSpill.push(oprand);
                // this.reservedRegisters.push(oprand as Register);
            }
        }
        //参数的位置要保留下来
        for (let j = 0; j < numArgs && j < 6; j++) {
            this.reservedRegisters.push(Register.paramRegisters32[j]);
        }
        //eax也要预留出来，防止spill过程中，其他寄存器的值被挪到这里来。
        this.reservedRegisters.push(Register.eax);
        //把前6个参数设置到寄存器
        //并且把需要覆盖的reg溢出
        let regsSpilled = [];
        for (let j = 0; j < numArgs && j < 6; j++) {
            let source = this.lowerOprand(liveVars, args[j], newInsts);
            let regDest = Register.paramRegisters32[j];
            let index = regsToSpill.indexOf(regDest);
            if (index != -1) {
                let varIndex = varsToSpill[index];
                this.spillVar(varIndex, regDest, newInsts);
                regsSpilled.push(regDest);
            }
            if (regDest !== source)
                newInsts.push(new Inst_2(OpCode.movl, source, regDest));
        }
        //Spill剩余的寄存器
        for (let i = 0; i < regsToSpill.length; i++) {
            if (regsSpilled.indexOf(regsToSpill[i])) {
                this.spillVar(varsToSpill[i], regsToSpill[i], newInsts);
            }
        }
        //超过6个之后的参数是放在栈桢里的，并要移动栈顶指针
        if (args.length > 6) {
            //参数是倒着排的。
            //栈顶是参数7，再往上，依次是参数8、参数9...
            //在Callee中，会到Caller的栈桢中去读取参数值
            for (let j = 6; j < numArgs; j++) {
                let offset = (j - 6) * 8;
                //如果args[j]是变量，则要放到寄存器里
                let oprand = this.lowerOprand(liveVars, args[j], newInsts, args[j].kind == OprandKind.varIndex);
                newInsts.push(new Inst_2(OpCode.movl, oprand, new MemAddress(Register.rsp, offset)));
            }
        }
        //调用函数，修改操作数为functionName
        newInsts.push(inst_1);
        //清除预留的寄存器
        this.reservedRegisters = [];
        return varsToSpill;
    }
    /**
     * Lower操作数。
     * 主要任务是给变量分配物理寄存器或内存地址。
     * 分配寄存器有几种场景：
     * 1.不要求返回值的类型
     * 如果操作数是源操作数，那么可以是寄存器，也可以是内存地址。优先分配寄存器。如果寄存器不足，则直接溢出到内存。
     * 2.要求返回值不能是内存地址
     * 如果操作数需要一个寄存器（典型的是加减乘除操作的一个操作数已经是内存地址了），那么就要分配一个寄存器给另一个寄存器。
     * 如果之前已经分配过了，并且不是寄存器，那么就溢出到内存。
     *
     * @param oprand
     */
    lowerOprand(liveVars, oprand, newInsts, noMemory = false) {
        let newOprand = oprand;
        //变量
        if (oprand.kind == OprandKind.varIndex) {
            let varIndex = oprand.value;
            if (this.loweredVars.has(varIndex)) {
                newOprand = this.loweredVars.get(varIndex);
                if (noMemory && newOprand.kind == OprandKind.memory) {
                    newOprand = this.reloadVar(varIndex, newInsts);
                }
            }
            else { //返回寄存器
                let reg = this.getFreeRegister(liveVars);
                if (reg == null) {
                    reg = this.spillARegister(newInsts);
                }
                this.assignRegToVar(varIndex, reg);
            }
        }
        //返回值
        else if (oprand.kind == OprandKind.returnSlot) {
            //因为返回值总是代码的最后一行，所以破坏掉里面的值也没关系
            newOprand = Register.eax;
        }
        return newOprand;
    }
    /**
     * 将某个变量溢出到内存。
     * @param varIndex
     * @param reg
     */
    spillVar(varIndex, reg, newInsts) {
        let address;
        if (this.spilledVars2Address.has(varIndex)) {
            address = this.spilledVars2Address.get(varIndex);
        }
        else {
            this.spillOffset += 4;
            address = new MemAddress(Register.rbp, -this.spillOffset);
            this.spilledVars2Address.set(varIndex, address);
            this.spilledVars2Reg.set(varIndex, reg);
        }
        newInsts.push(new Inst_2(OpCode.movl, reg, address, "spill\tvar" + varIndex));
        this.loweredVars.set(varIndex, address);
        return address;
    }
    reloadVar(varIndex, newInsts) {
        let oprand = this.loweredVars.get(varIndex);
        if (oprand.kind == OprandKind.memory) {
            let address = oprand;
            let reg = this.spilledVars2Reg.get(varIndex);
            //查看该reg是否正在被其他变量占用
            for (let varIndex1 of this.loweredVars.keys()) {
                let oprand1 = this.loweredVars.get(varIndex1);
                if (oprand1 == reg) {
                    this.spillVar(varIndex, oprand1, newInsts);
                    break;
                }
            }
            this.assignRegToVar(varIndex, reg);
            newInsts.push(new Inst_2(OpCode.movl, address, reg, "reload\tvar" + varIndex));
            return reg;
        }
        return null;
    }
    /**
     * 选一个寄存器，溢出出去。
     */
    spillARegister(newInsts) {
        for (let varIndex of this.loweredVars.keys()) {
            let oprand = this.loweredVars.get(varIndex);
            if (oprand.kind == OprandKind.register && this.reservedRegisters.indexOf(oprand) != -1) {
                this.spillVar(varIndex, oprand, newInsts);
            }
        }
        //理论上，不会到达这里。
        return null;
    }
    assignRegToVar(varIndex, reg) {
        //更新usedCalleeProtectedRegs
        if (Register.calleeProtected32.indexOf(reg) != -1 && this.usedCalleeProtectedRegs.indexOf(reg) == -1) {
            this.usedCalleeProtectedRegs.push(reg);
        }
        //更新loweredVars
        this.loweredVars.set(varIndex, reg);
    }
    /**
     * 获取一个空余的寄存器
     * @param liveVars
     */
    getFreeRegister(liveVars) {
        let result = null;
        //1.从空余的寄存器中寻找一个。
        let allocatedRegisters = [];
        this.loweredVars.forEach((oprand, varIndex) => {
            //已经lower了的每个变量，都会锁定一个寄存器。
            if (oprand.kind == OprandKind.register) {
                allocatedRegisters.push(oprand);
            }
            else {
                allocatedRegisters.push(this.spilledVars2Reg.get(varIndex));
            }
        });
        for (let reg of Register.registers32) {
            if (allocatedRegisters.indexOf(reg) == -1 && this.reservedRegisters.indexOf(reg) == -1) {
                result = reg;
                break;
            }
        }
        //2.从已分配的varIndex里面找一个
        // if (result == null){
        //     for (let varIndex of this.loweredVars.keys()){
        //         // todo 下面的逻辑是不安全的，在存在cfg的情况下，不能简单的判断变量是否真的没用了。
        //         if (liveVars.indexOf(varIndex) == -1){
        //             let oprand = this.loweredVars.get(varIndex) as Oprand;
        //             if (oprand.kind == OprandKind.register && this.reservedRegisters.indexOf(oprand as Register)==-1){
        //                 result = oprand as Register;
        //                 this.loweredVars.delete(varIndex);
        //                 break;
        //             }
        //         }
        //     }
        // }
        return result;
    }
    saveCalleeProtectedRegs(newInsts) {
        for (let i = 0; i < this.usedCalleeProtectedRegs.length; i++) {
            let regIndex = Register.calleeProtected32.indexOf(this.usedCalleeProtectedRegs[i]);
            let reg64 = Register.calleeProtected64[regIndex];
            newInsts.push(new Inst_1(OpCode.pushq, reg64));
        }
    }
    restoreCalleeProtectedRegs(newInsts) {
        for (let i = this.usedCalleeProtectedRegs.length - 1; i >= 0; i--) {
            let regIndex = Register.calleeProtected32.indexOf(this.usedCalleeProtectedRegs[i]);
            let reg64 = Register.calleeProtected64[regIndex];
            newInsts.push(new Inst_1(OpCode.popq, reg64));
        }
    }
}
function compileToAsm(prog, verbose) {
    let asmGenerator = new AsmGenerator();
    //生成LIR
    let asmModule = asmGenerator.visit(prog);
    if (verbose) {
        console.log("在Lower之前：");
        console.log(asmModule.toString());
    }
    //变量活跃性分析
    let livenessAnalyzer = new LivenessAnalyzer(asmModule);
    let result = livenessAnalyzer.execute();
    if (verbose) {
        console.log("liveVars");
        for (let fun of asmModule.fun2Code.keys()) {
            console.log("\nfunction: " + fun.name);
            let bbs = asmModule.fun2Code.get(fun);
            for (let bb of bbs) {
                console.log("\nbb:" + bb.getName());
                for (let inst of bb.insts) {
                    let vars = result.liveVars.get(inst);
                    console.log(vars);
                    console.log(inst.toString());
                }
                console.log(result.initialVars.get(bb));
            }
        }
    }
    // Lower
    let lower = new Lower(asmModule, result);
    lower.lowerModule();
    for (let fun of asmModule.fun2Code.keys()) {
        console.log("\nfunction: " + fun.name);
        let bbs = asmModule.fun2Code.get(fun);
        console.log(bbs);
    }
    let asm = asmModule.toString();
    if (verbose) {
        console.log("在Lower之后：");
        console.log(asm);
    }
    return asm;
}
exports.compileToAsm = compileToAsm;
/**
 * 变量活跃性分析的结果
 */
class LivenessResult {
    constructor() {
        this.liveVars = new Map();
        this.initialVars = new Map();
    }
}
/**
 * 控制流图
 */
class CFG {
    constructor(bbs) {
        //每个BasicBlock输出的边
        this.edgesOut = new Map();
        //每个BasicBlock输入的边
        this.edgesIn = new Map();
        this.bbs = bbs;
        this.buildCFG();
    }
    buildCFG() {
        //构建edgesOut;
        for (let i = 0; i < this.bbs.length - 1; i++) { //最后一个基本块不用分析
            let bb = this.bbs[i];
            let toBBs = [];
            this.edgesOut.set(bb, toBBs);
            let lastInst = bb.insts[bb.insts.length - 1];
            if (OpCodeHelper.isJump(lastInst.op)) {
                let jumpInst = lastInst;
                let destBB = jumpInst.oprand.value;
                toBBs.push(destBB);
                //如果是条件分枝，那么还要加上下面紧挨着的BasicBlock
                if (jumpInst.op != OpCode.jmp) {
                    toBBs.push(this.bbs[i + 1]);
                }
            }
            else { //如果最后一条语句不是跳转语句，则连接到下一个BB
                toBBs.push(this.bbs[i + 1]);
            }
        }
        //构建反向的边:edgesIn
        for (let bb of this.edgesOut.keys()) {
            let toBBs = this.edgesOut.get(bb);
            for (let toBB of toBBs) {
                let fromBBs = this.edgesIn.get(toBB);
                if (typeof fromBBs == 'undefined') {
                    fromBBs = [];
                    this.edgesIn.set(toBB, fromBBs);
                }
                fromBBs.push(bb);
            }
        }
    }
    toString() {
        let str = "";
        str += "bbs:\n";
        for (let bb of this.bbs) {
            str += "\t" + bb.getName() + "\n";
        }
        str += "edgesOut:\n";
        for (let bb of this.edgesOut.keys()) {
            str += "\t" + bb.getName() + "->\n";
            let toBBs = this.edgesOut.get(bb);
            for (let bb2 of toBBs) {
                str += "\t\t" + bb2.getName() + "\n";
            }
        }
        str += "edgesIn:\n";
        for (let bb of this.edgesIn.keys()) {
            str += "\t" + bb.getName() + "<-\n";
            let fromBBs = this.edgesIn.get(bb);
            for (let bb2 of fromBBs) {
                str += "\t\t" + bb2.getName() + "\n";
            }
        }
        return str;
    }
}
/**
 * 变量活跃性分析。
 */
class LivenessAnalyzer {
    constructor(asmModule) {
        this.asmModule = asmModule;
    }
    execute() {
        let result = new LivenessResult();
        for (let fun of this.asmModule.fun2Code.keys()) {
            let bbs = this.asmModule.fun2Code.get(fun);
            this.analyzeFunction(bbs, result);
        }
        return result;
    }
    /**
     * 给一个函数做变量活跃性分析。
     * 每个函数的CFG是一个有角的图（rooted graph）。
     * 我们多次遍历这个图，每次一个基本块的输出会作为另一个基本块的输入。
     * 只有当遍历的时候，没有活跃变量的集合发生变化，算法才结束。
     * @param fun
     * @param bbs
     * @param funIndex
     * @param result
     */
    analyzeFunction(bbs, result) {
        let cfg = new CFG(bbs);
        console.log(cfg.toString());
        //做一些初始化工作
        for (let bb of bbs) {
            result.initialVars.set(bb, []);
        }
        //持续遍历图，直到没有BasicBlock的活跃变量需要被更新
        let bbsToDo = bbs.slice(0);
        while (bbsToDo.length > 0) {
            let bb = bbsToDo.pop();
            this.analyzeBasicBlock(bb, result);
            //取出第一行的活跃变量集合，作为对前面的BasicBlock的输入
            let liveVars = bb.insts.length == 0 ? [] : result.liveVars.get(bb.insts[0]);
            let fromBBs = cfg.edgesIn.get(bb);
            if (typeof fromBBs != 'undefined') {
                for (let bb2 of fromBBs) {
                    let liveVars2 = result.initialVars.get(bb2);
                    //如果能向上面的BB提供不同的活跃变量，则需要重新分析bb2
                    if (!this.isSubsetOf(liveVars, liveVars2)) {
                        if (bbsToDo.indexOf(bb2) == -1)
                            bbsToDo.push(bb2);
                        let unionVars = this.unionOf(liveVars, liveVars2);
                        result.initialVars.set(bb2, unionVars);
                    }
                }
            }
        }
    }
    /**
     * set1是不是set2的子集
     * @param set1
     * @param set2
     */
    isSubsetOf(set1, set2) {
        if (set1.length <= set2.length) {
            for (let n of set1) {
                if (set2.indexOf(n) == -1) {
                    return false;
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * 返回set1和set2的并集
     * @param set1
     * @param set2
     */
    unionOf(set1, set2) {
        let set3 = set1.slice(0);
        for (let n of set2) {
            if (set3.indexOf(n) == -1) {
                set3.push(n);
            }
        }
        return set3;
    }
    /**
     * 给基本块做活跃性分析。
     * 算法：从基本块的最后一条指令倒着做分析。
     * @param bb
     * @param result
     */
    analyzeBasicBlock(bb, result) {
        let changed = false;
        //找出BasicBlock初始的集合
        let vars = result.initialVars.get(bb);
        vars = vars.slice(0); //克隆一份
        //为每一条指令计算活跃变量集合
        for (let i = bb.insts.length - 1; i >= 0; i--) {
            let inst = bb.insts[i];
            if (inst.numOprands == 1) {
                let inst_1 = inst;
                //变量声明伪指令，从liveVars集合中去掉该变量
                if (inst_1.op == OpCode.declVar) {
                    let varIndex = inst_1.oprand.value;
                    let indexInArray = vars.indexOf(varIndex);
                    if (indexInArray != -1) {
                        vars.splice(indexInArray, 1);
                    }
                }
                //查看指令中引用了哪个变量，就加到liveVars集合中去
                else {
                    this.updateLiveVars(inst_1, inst_1.oprand, vars);
                }
            }
            else if (inst.numOprands == 2) {
                let inst_2 = inst;
                this.updateLiveVars(inst_2, inst_2.oprand1, vars);
                this.updateLiveVars(inst_2, inst_2.oprand2, vars);
            }
            result.liveVars.set(inst, vars);
            vars = vars.slice(0); //克隆一份，用于下一条指令
        }
        return changed;
    }
    /**
     * 把操作数用到的变量增加到当前指令的活跃变量集合里面。
     * @param inst
     * @param oprand
     * @param vars
     */
    updateLiveVars(inst, oprand, vars) {
        if (oprand.kind == OprandKind.varIndex) {
            let varIndex = oprand.value;
            if (vars.indexOf(varIndex) == -1) {
                vars.push(varIndex);
            }
        }
        else if (oprand.kind == OprandKind.function) {
            let functionOprand = oprand;
            for (let arg of functionOprand.args) {
                this.updateLiveVars(inst, arg, vars);
            }
        }
    }
}

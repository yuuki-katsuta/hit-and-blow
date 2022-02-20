"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var printLine = function (text, breakLine) {
    if (breakLine === void 0) { breakLine = true; }
    process.stdout.write(text + (breakLine ? '\n' : ''));
};
var promptInput = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    var input;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                printLine("\n" + text + "\n>", false);
                return [4 /*yield*/, new Promise(function (resolve) {
                        return process.stdin.once('data', function (data) { return resolve(data.toString()); });
                    })];
            case 1:
                input = _a.sent();
                return [2 /*return*/, input.trim()];
        }
    });
}); };
var HitAndBlow = /** @class */ (function () {
    function HitAndBlow() {
        //初期値のセットは演算処理がなければ constructorを介す必要はない
        this.answerSource = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
        ];
        this.answer = [];
        this.tryCount = 0;
    }
    //３つの数字を決定
    HitAndBlow.prototype.setting = function () {
        var answrLength = 3;
        while (this.answer.length < answrLength) {
            var num = Math.floor(Math.random() * this.answerSource.length);
            var selectedItem = this.answerSource[num];
            if (!this.answer.includes(selectedItem)) {
                this.answer.push(selectedItem);
            }
        }
    };
    HitAndBlow.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inputArr, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promptInput('[,]区切りで3つの数字を入力してください')];
                    case 1:
                        inputArr = (_a.sent()).split(',');
                        if (!!this.validate(inputArr)) return [3 /*break*/, 3];
                        printLine('無効な入力です!');
                        return [4 /*yield*/, this.play()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        result = this.check(inputArr);
                        if (!(result.hit === this.answer.length)) return [3 /*break*/, 4];
                        this.tryCount += 1;
                        return [3 /*break*/, 6];
                    case 4:
                        printLine("---\nHit: " + result.hit + "\nBlow: " + result.blow + "\n---}");
                        this.tryCount += 1;
                        return [4 /*yield*/, this.play()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //外部からアクセスしているわけではないのでprivate修飾子を付与
    HitAndBlow.prototype.check = function (input) {
        var _this = this;
        var hitCount = 0;
        var blowCount = 0;
        input.forEach(function (val, index) {
            if (val === _this.answer[index])
                hitCount += 1;
            else if (_this.answer.includes(val))
                blowCount += 1;
        });
        return {
            hit: hitCount,
            blow: blowCount
        };
    };
    HitAndBlow.prototype.validate = function (inputArr) {
        var _this = this;
        var isLengthValid = inputArr.length === this.answer.length;
        //answerSourceに含まれるか
        var isAllAnswerSourceOption = inputArr.every(function (val) {
            return _this.answerSource.includes(val);
        });
        //重複チェック
        var isAllDifferentValues = inputArr.every(function (val, i) { return inputArr.indexOf(val) === i; });
        return isLengthValid && isAllAnswerSourceOption && isAllDifferentValues;
    };
    HitAndBlow.prototype.end = function () {
        printLine("\u6B63\u89E3\u3067\u3059!! \n\u8A66\u884C\u56DE\u6570: " + this.tryCount + "\u56DE");
        process.exit();
    };
    return HitAndBlow;
}());
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var hitandblow;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hitandblow = new HitAndBlow();
                hitandblow.setting();
                return [4 /*yield*/, hitandblow.play()];
            case 1:
                _a.sent();
                hitandblow.end();
                return [2 /*return*/];
        }
    });
}); })();

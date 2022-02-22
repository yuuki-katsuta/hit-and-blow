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
exports.__esModule = true;
var hitAndBlow_1 = require("./hitAndBlow");
var janken_1 = require("./janken");
var print_1 = require("./print");
var print_2 = require("./print");
var nextActions = ['play again', 'change game', 'exit'];
var gameTitles = ['hit and blow', 'janken'];
var GameProcedure = /** @class */ (function () {
    //インスタンス化されるときgameStoreプロパティがセットされる.readonlyなどの修飾子があればプロパティに自動セットされる
    function GameProcedure(gameStore) {
        this.gameStore = gameStore;
        this.currentGameTitle = '';
        this.currentGame = null;
    }
    GameProcedure.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.select()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.play()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameProcedure.prototype.select = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, print_2.promptSelect('ゲームのタイトルを入力してください', gameTitles)];
                    case 1:
                        _a.currentGameTitle = _b.sent();
                        this.currentGame = this.gameStore[this.currentGameTitle];
                        return [2 /*return*/];
                }
            });
        });
    };
    GameProcedure.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var action, neverValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.currentGame)
                            throw new Error('ゲームが選択されていません');
                        print_1.printLine("===\n" + this.currentGameTitle + "\u3092\u958B\u59CB\u3059\u308B\u3088!\n===");
                        return [4 /*yield*/, this.currentGame.setting()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.currentGame.play()];
                    case 2:
                        _a.sent();
                        this.currentGame.end();
                        return [4 /*yield*/, print_2.promptSelect('ゲームを続けますか?', nextActions)];
                    case 3:
                        action = _a.sent();
                        if (!(action === 'play again')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.play()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 5:
                        if (!(action === 'change game')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.select()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.play()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        if (action === 'exit')
                            this.end();
                        else {
                            neverValue = action;
                            throw new Error(neverValue + " is an invalid action");
                        }
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    GameProcedure.prototype.end = function () {
        print_1.printLine('ゲームを終了しました!');
        process.exit();
    };
    return GameProcedure;
}());
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        new GameProcedure({
            'hit and blow': new hitAndBlow_1.HitAndBlow(),
            janken: new janken_1.Janken()
        }).start();
        return [2 /*return*/];
    });
}); })();

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const instantiation_1 = require("../../../core/instantiation/common/instantiation");
const mocha_1 = require("mocha");
const serviceCollection_1 = require("../../../core/instantiation/common/serviceCollection");
const descriptors_1 = require("../../../core/instantiation/common/descriptors");
const instantiationService_1 = require("../../../core/instantiation/common/instantiationService");
const assert_1 = __importDefault(require("assert"));
const IService1 = (0, instantiation_1.createDecorator)('IService1');
class Service1 {
    log() {
        console.log('Service1 执行log');
    }
}
const IService2 = (0, instantiation_1.createDecorator)('IService2');
class Service2 {
    log() {
        console.log('Service2 执行log');
    }
}
const IService3 = (0, instantiation_1.createDecorator)('IService3');
let Service3 = class Service3 {
    constructor(service2) {
        this.service2 = service2;
    }
    log() {
        console.log('Service3 执行log，并且执行执行Service2的log');
        this.service2.log();
    }
};
Service3 = __decorate([
    __param(0, IService2),
    __metadata("design:paramtypes", [Object])
], Service3);
(0, mocha_1.suite)('Instantiation', () => {
    (0, mocha_1.test)('create service', () => {
        const serviceCollection = new serviceCollection_1.ServiceCollection();
        serviceCollection.set(IService1, new descriptors_1.SyncDescriptor(Service1));
        serviceCollection.set(IService2, new descriptors_1.SyncDescriptor(Service2));
        serviceCollection.set(IService3, new descriptors_1.SyncDescriptor(Service3));
        const instantiationService = new instantiationService_1.InstantiationService(serviceCollection);
        instantiationService.invokeFunction(accessor => {
            const service1Instance = accessor.get(IService1);
            assert_1.default.ok(service1Instance);
            service1Instance.log();
            const service2Instance = accessor.get(IService2);
            assert_1.default.ok(service2Instance);
            service2Instance.log();
            const service3Instance = accessor.get(IService3);
            assert_1.default.ok(service3Instance);
            service3Instance.log();
        });
    });
    (0, mocha_1.test)('Params Decorator', () => {
        // let type: ParameterDecorator;
        function logParams(params) {
            console.log(params); // 装饰器传入的参数：uuid
            return function (target, methodName, paramIndex) {
                console.log(target); // { constructor:f, getData:f }
                console.log(methodName); // getData
                console.log(paramIndex); // 0
            };
        }
        class HttpClient {
            constructor() { }
            getData(uuid) {
                console.log(uuid);
            }
        }
        __decorate([
            __param(0, logParams('uuid')),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], HttpClient.prototype, "getData", null);
        const httpClient = new HttpClient();
        assert_1.default.ok(httpClient);
        httpClient.getData('123');
    });
});

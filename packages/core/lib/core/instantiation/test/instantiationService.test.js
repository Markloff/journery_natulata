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
const assert_1 = __importDefault(require("assert"));
const mocha_1 = require("mocha");
const serviceCollection_1 = require("../../../core/instantiation/common/serviceCollection");
const instantiationService_1 = require("../../../core/instantiation/common/instantiationService");
const descriptors_1 = require("../../../core/instantiation/common/descriptors");
let IService1 = (0, instantiation_1.createDecorator)('service1');
class Service1 {
    constructor() {
        this.c = 1;
    }
}
let IService2 = (0, instantiation_1.createDecorator)('service2');
class Service2 {
    constructor() {
        this.d = true;
    }
}
let IService3 = (0, instantiation_1.createDecorator)('service3');
class Service3 {
    constructor() {
        this.s = 'farboo';
    }
}
let IDependentService = (0, instantiation_1.createDecorator)('dependentService');
let DependentService = class DependentService {
    constructor(service) {
        this.name = 'farboo';
        assert_1.default.strictEqual(service.c, 1);
    }
};
DependentService = __decorate([
    __param(0, IService1),
    __metadata("design:paramtypes", [Object])
], DependentService);
let Service1Consumer = class Service1Consumer {
    constructor(service1) {
        assert_1.default.ok(service1);
        assert_1.default.strictEqual(service1.c, 1);
    }
};
Service1Consumer = __decorate([
    __param(0, IService1),
    __metadata("design:paramtypes", [Object])
], Service1Consumer);
let Target2Dep = class Target2Dep {
    constructor(service1, service2) {
        assert_1.default.ok(service1 instanceof Service1);
        assert_1.default.ok(service2 instanceof Service2);
    }
};
Target2Dep = __decorate([
    __param(0, IService1),
    __param(1, IService2),
    __metadata("design:paramtypes", [Object, Object])
], Target2Dep);
let TargetWithStaticParam = class TargetWithStaticParam {
    constructor(v, service1) {
        assert_1.default.ok(v);
        assert_1.default.ok(service1);
        assert_1.default.strictEqual(service1.c, 1);
    }
};
TargetWithStaticParam = __decorate([
    __param(1, IService1),
    __metadata("design:paramtypes", [Boolean, Object])
], TargetWithStaticParam);
let TargetOptional = class TargetOptional {
    constructor(service1, service2) {
        assert_1.default.ok(service1);
        assert_1.default.strictEqual(service1.c, 1);
        assert_1.default.ok(service2 === undefined);
    }
};
TargetOptional = __decorate([
    __param(0, IService1),
    __param(1, (0, instantiation_1.optional)(IService2)),
    __metadata("design:paramtypes", [Object, Object])
], TargetOptional);
let TargetNotOptional = class TargetNotOptional {
    constructor(service1, service2) {
    }
};
TargetNotOptional = __decorate([
    __param(0, IService1),
    __param(1, IService2),
    __metadata("design:paramtypes", [Object, Object])
], TargetNotOptional);
let DependentServiceTarget = class DependentServiceTarget {
    constructor(d) {
        assert_1.default.ok(d);
        assert_1.default.strictEqual(d.name, 'farboo');
    }
};
DependentServiceTarget = __decorate([
    __param(0, IDependentService),
    __metadata("design:paramtypes", [Object])
], DependentServiceTarget);
let DependentServiceTarget2 = class DependentServiceTarget2 {
    constructor(d, s) {
        assert_1.default.ok(d);
        assert_1.default.strictEqual(d.name, 'farboo');
        assert_1.default.ok(s);
        assert_1.default.strictEqual(s.c, 1);
    }
};
DependentServiceTarget2 = __decorate([
    __param(0, IDependentService),
    __param(1, IService1),
    __metadata("design:paramtypes", [Object, Object])
], DependentServiceTarget2);
let ServiceLoop1 = class ServiceLoop1 {
    constructor(s) {
        this.c = 1;
    }
};
ServiceLoop1 = __decorate([
    __param(0, IService2),
    __metadata("design:paramtypes", [Object])
], ServiceLoop1);
let ServiceLoop2 = class ServiceLoop2 {
    constructor(s) {
        this.d = true;
    }
};
ServiceLoop2 = __decorate([
    __param(0, IService1),
    __metadata("design:paramtypes", [Object])
], ServiceLoop2);
(0, mocha_1.suite)('Instantiation Service', () => {
    (0, mocha_1.test)('service collection, cannot overwrite', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let result = collection.set(IService1, null);
        assert_1.default.strictEqual(result, undefined);
        result = collection.set(IService1, new Service1());
        assert_1.default.strictEqual(result, null);
    });
    (0, mocha_1.test)('service collection, add/has', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        collection.set(IService1, null);
        assert_1.default.ok(collection.has(IService1));
        collection.set(IService2, null);
        assert_1.default.ok(collection.has(IService1));
        assert_1.default.ok(collection.has(IService2));
    });
    (0, mocha_1.test)('@Param - simple class', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new Service1());
        collection.set(IService2, new Service2());
        collection.set(IService3, new Service3());
        console.log(service.createInstance(Service1Consumer));
    });
    (0, mocha_1.test)('@Param - fixed args', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new Service1());
        collection.set(IService2, new Service2());
        collection.set(IService3, new Service3());
        console.log(service.createInstance(TargetWithStaticParam, true));
    });
    (0, mocha_1.test)('service collection is live', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        collection.set(IService1, new Service1());
        let service = new instantiationService_1.InstantiationService(collection);
        service.createInstance(Service1Consumer);
        assert_1.default.throws(() => service.createInstance(Target2Dep));
        service.invokeFunction((a) => {
            assert_1.default.ok(a.get(IService1));
            assert_1.default.ok(!a.get(IService2, instantiation_1.optional));
        });
        collection.set(IService2, new Service2());
        service.createInstance(Target2Dep);
        service.invokeFunction((a) => {
            assert_1.default.ok(a.get(IService1));
            assert_1.default.ok(a.get(IService2));
        });
    });
    (0, mocha_1.test)('@Param -optional', () => {
        let collection = new serviceCollection_1.ServiceCollection([IService1, new Service1()]);
        let service = new instantiationService_1.InstantiationService(collection, true);
        service.createInstance(TargetOptional);
        assert_1.default.throws(() => service.createInstance(TargetNotOptional));
        service = new instantiationService_1.InstantiationService(collection, false);
        service.createInstance(TargetOptional);
        service.createInstance(TargetNotOptional);
    });
    (0, mocha_1.test)('SyncDesc -no dependencies', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new descriptors_1.SyncDescriptor(Service1));
        service.invokeFunction(accessor => {
            let service1 = accessor.get(IService1);
            assert_1.default.ok(service1);
            assert_1.default.strictEqual(service1.c, 1);
            let service2 = accessor.get(IService1);
            assert_1.default.ok(service1 === service2);
        });
    });
    (0, mocha_1.test)('SyncDesc - service with service dependency', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new descriptors_1.SyncDescriptor(Service1));
        collection.set(IDependentService, new descriptors_1.SyncDescriptor(DependentService));
        service.invokeFunction(accessor => {
            let d = accessor.get(IDependentService);
            assert_1.default.ok(d);
            assert_1.default.strictEqual(d.name, 'farboo');
        });
    });
    (0, mocha_1.test)('SyncDesc - target depends on service future', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new descriptors_1.SyncDescriptor(Service1));
        collection.set(IDependentService, new descriptors_1.SyncDescriptor(DependentService));
        let d = service.createInstance(DependentServiceTarget);
        assert_1.default.ok(d instanceof DependentServiceTarget);
        let d2 = service.createInstance(DependentServiceTarget2);
        assert_1.default.ok(d2 instanceof DependentServiceTarget2);
    });
    (0, mocha_1.test)('SyncDesc - explode on loop', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new descriptors_1.SyncDescriptor(ServiceLoop1));
        collection.set(IService2, new descriptors_1.SyncDescriptor(ServiceLoop2));
        assert_1.default.throws(() => {
            service.invokeFunction(accessor => {
                accessor.get(IService1);
            });
        });
        assert_1.default.throws(() => {
            service.invokeFunction(accessor => {
                accessor.get(IService2);
            });
        });
        try {
            service.invokeFunction(accessor => {
                accessor.get(IService1);
            });
        }
        catch (err) {
            assert_1.default.ok(err.name);
            assert_1.default.ok(err.message);
        }
    });
    (0, mocha_1.test)('Invoke - get services', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new Service1());
        collection.set(IService2, new Service2());
        function test(accessor) {
            assert_1.default.ok(accessor.get(IService1) instanceof Service1);
            assert_1.default.strictEqual(accessor.get(IService1).c, 1);
            return true;
        }
        assert_1.default.strictEqual(service.invokeFunction(test), true);
    });
    (0, mocha_1.test)('Invoke - get service optional', () => {
        let collection = new serviceCollection_1.ServiceCollection([IService1, new Service1()]);
        let service = new instantiationService_1.InstantiationService(collection);
        function test(accessor) {
            assert_1.default.ok(accessor.get(IService1) instanceof Service1);
            assert_1.default.throws(() => accessor.get(IService2));
            assert_1.default.strictEqual(accessor.get(IService2, instantiation_1.optional), undefined);
            return true;
        }
        assert_1.default.strictEqual(service.invokeFunction(test), true);
    });
    (0, mocha_1.test)('Invoke - keeping accessor NOT allowed', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new Service1());
        collection.set(IService2, new Service2());
        let cached;
        function test(accessor) {
            assert_1.default.ok(accessor.get(IService1) instanceof Service1);
            assert_1.default.strictEqual(accessor.get(IService1).c, 1);
            cached = accessor;
            return true;
        }
        assert_1.default.strictEqual(service.invokeFunction(test), true);
        assert_1.default.throws(() => cached.get(IService1));
    });
    (0, mocha_1.test)('Invoke - throw err', () => {
        let collection = new serviceCollection_1.ServiceCollection();
        let service = new instantiationService_1.InstantiationService(collection);
        collection.set(IService1, new Service1());
        collection.set(IService2, new Service2());
        function test(accessor) {
            throw new Error();
        }
        assert_1.default.throws(() => service.invokeFunction(test));
    });
    (0, mocha_1.test)('Create child', () => {
        let serviceInstanceCount = 0;
        const CtorCounter = class {
            constructor() {
                this.c = 1;
                serviceInstanceCount += 1;
            }
        };
        let service = new instantiationService_1.InstantiationService(new serviceCollection_1.ServiceCollection([IService1, new descriptors_1.SyncDescriptor(CtorCounter)]));
        service.createInstance(Service1Consumer);
        let child = service.createChild(new serviceCollection_1.ServiceCollection([IService2, new Service2()]));
        child.createInstance(Service1Consumer);
        assert_1.default.strictEqual(serviceInstanceCount, 1);
        serviceInstanceCount = 0;
        service = new instantiationService_1.InstantiationService(new serviceCollection_1.ServiceCollection([IService1, new descriptors_1.SyncDescriptor(CtorCounter)]));
        child = service.createChild(new serviceCollection_1.ServiceCollection([IService2, new Service2()]));
        service.createInstance(Service1Consumer);
        child.createInstance(Service1Consumer);
        assert_1.default.strictEqual(serviceInstanceCount, 1);
    });
    (0, mocha_1.test)('service dependent on instantiation service and recursive call', () => {
        const Service1 = (0, instantiation_1.createDecorator)('service1');
        let Service1Impl = class Service1Impl {
            constructor(insta) {
                const c = insta.invokeFunction(accessor => accessor.get(Service2)); // THIS is the recursive call
                assert_1.default.ok(c);
            }
        };
        Service1Impl = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __metadata("design:paramtypes", [Object])
        ], Service1Impl);
        const Service2 = (0, instantiation_1.createDecorator)('service2');
        class Service2Impl {
            constructor() { }
        }
        // This service depends on Service1 and Service2 BUT creating Service1 creates Service2 (via recursive invocation)
        // and then Servce2 should not be created a second time
        const Service21 = (0, instantiation_1.createDecorator)('service21');
        let Service21Impl = class Service21Impl {
            constructor(service2, service1) {
                this.service2 = service2;
                this.service1 = service1;
            }
        };
        Service21Impl = __decorate([
            __param(0, Service2),
            __param(1, Service1),
            __metadata("design:paramtypes", [Service2Impl, Service1Impl])
        ], Service21Impl);
        const insta = new instantiationService_1.InstantiationService(new serviceCollection_1.ServiceCollection([Service1, new descriptors_1.SyncDescriptor(Service1Impl)], [Service2, new descriptors_1.SyncDescriptor(Service2Impl)], [Service21, new descriptors_1.SyncDescriptor(Service21Impl)]));
        const obj = insta.invokeFunction(accessor => accessor.get(Service21));
        assert_1.default.ok(obj);
    });
});

import {
	createDecorator,
} from '@/core/instantiation/common/instantiation';
import { suite, test  } from 'mocha';
import { ServiceCollection } from '@/core/instantiation/common/serviceCollection';
import { SyncDescriptor } from '@/core/instantiation/common/descriptors';
import { InstantiationService } from '@/core/instantiation/common/instantiationService';
import assert from 'assert';

interface IService1 {

	log(): void;
}

const IService1 = createDecorator<IService1>('IService1');

class Service1 implements IService1 {

	log() {
		console.log('Service1 执行log')
	}

}


interface IService2 {

	log(): void;
}

const IService2 = createDecorator<IService2>('IService2');

class Service2 implements IService2 {

	log() {
		console.log('Service2 执行log')
	}

}


interface IService3 {

	log(): void;
}

const IService3 = createDecorator<IService3>('IService3');

class Service3 implements IService3 {

	constructor(
		@IService2 private readonly service2: IService2
	) {

	}

	log() {
		console.log('Service3 执行log，并且执行执行Service2的log')
		this.service2.log();
	}

}


suite('Instantiation', () => {

	test('create service', () => {

		const serviceCollection = new ServiceCollection();
		serviceCollection.set(IService1, new SyncDescriptor<IService1>(Service1));
		serviceCollection.set(IService2, new SyncDescriptor<IService2>(Service2));
		serviceCollection.set(IService3, new SyncDescriptor<IService3>(Service3));

		const instantiationService = new InstantiationService(serviceCollection);

		instantiationService.invokeFunction(accessor => {


			const service1Instance = accessor.get(IService1);
			assert.ok(service1Instance);
			service1Instance.log();

			const service2Instance = accessor.get(IService2);
			assert.ok(service2Instance);
			service2Instance.log();

			const service3Instance = accessor.get(IService3);
			assert.ok(service3Instance);
			service3Instance.log();

		})

	})

	test('Params Decorator', () => {

		// let type: ParameterDecorator;

		function logParams(params:any) {
			console.log(params)  // 装饰器传入的参数：uuid
			return function(target:any, methodName:any, paramIndex:any) {
				console.log(target)  // { constructor:f, getData:f }
				console.log(methodName)  // getData
				console.log(paramIndex)  // 0
			}
		}
		class HttpClient {
			constructor() { }
			getData(@logParams('uuid') uuid:any) {
				console.log(uuid);
			}
		}

		const httpClient = new HttpClient();

		assert.ok(httpClient);
		httpClient.getData('123');

	})

})













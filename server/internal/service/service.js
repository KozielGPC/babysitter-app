import { Service } from '../entity/service.js';
import { v4 as uuidv4 } from 'uuid';
import { BabysitterAlreadyAssigned } from './errors.js';

export class ServiceService {
    constructor({ serviceRepository }) {
        this.serviceRepository = serviceRepository;
    }

    async getByID(id) {
        return this.serviceRepository.getByID(id);
    }

    async list() {
        return this.serviceRepository.list();
    }

    async create(createServiceDTO) {
        const service = new Service({
            id: uuidv4(),
            babysitterId: null,
            tutorId: createServiceDTO.tutorId,
            startDate: createServiceDTO.startDate,
            endDate: createServiceDTO.endDate,
            value: createServiceDTO.value,
            childrenCount: createServiceDTO.childrenCount,
            address: createServiceDTO.address,
            enrollments: [],
        });

        return this.serviceRepository.create(service);
    }

    async enrollBabysitter(enrollBabysitterDTO) {
        const foundService = await this.serviceRepository.getByID(enrollBabysitterDTO.serviceId)
        
        if (!foundService) {
            return foundService
        }

        if (foundService.babysitterId) {
            throw new BabysitterAlreadyAssigned;
        }

        if (foundService.enrollments.find(enrollment => enrollment.babysitterId === enrollBabysitterDTO.babysitterId)) {
            throw new BabysitterAlreadyAssigned;
        }

        foundService.enrollments = foundService.enrollments.map(enrollment => enrollment.babysitterId);
        foundService.enrollments.push(enrollBabysitterDTO.babysitterId);

        await this.serviceRepository.update(foundService);

        return foundService;
    }

    async chooseEnrollment(chooseEnrollmentDTO) {
        const foundService = await this.serviceRepository.getByID(chooseEnrollmentDTO.serviceId)
        
        if (!foundService) {
            return foundService
        }

        if (foundService.tutorId !== chooseEnrollmentDTO.tutorId) {
            throw new Error('Service does not belong to informed tutor');
        }

        if (foundService.babysitterId) {
            throw new BabysitterAlreadyAssigned;
        }

        if (!foundService.enrollments.find(enrollment => enrollment.babysitterId === chooseEnrollmentDTO.babysitterId)) {
            throw new Error('Informed babysitter is not enrolled in service');
        }

        foundService.babysitterId = chooseEnrollmentDTO.babysitterId;
        foundService.enrollments = [];

        await this.serviceRepository.update(foundService);

        return foundService;
    }

    async update(updateServiceDTO) {
        const foundService = await this.serviceRepository.getByID(updateServiceDTO.id)
        
        if (!foundService) {
            return foundService
        }

        if (foundService.babysitterId) {
            throw new BabysitterAlreadyAssigned;
        }

        foundService.startDate = updateServiceDTO.startDate || foundService.startDate;
        foundService.endDate = updateServiceDTO.endDate || foundService.endDate;
        foundService.value = updateServiceDTO.value || foundService.value;
        foundService.childrenCount = updateServiceDTO.childrenCount || foundService.childrenCount;
        foundService.address = updateServiceDTO.address || foundService.address;

        await this.serviceRepository.update(foundService);

        return foundService;
    }
}
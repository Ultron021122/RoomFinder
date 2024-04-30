import { getUsers } from '../controller/users.js';

describe('getUsers', () => {
    it('should return a list of users', async () => {
        const mockUsersModel = {
            findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Test User' }]),
        };
        const users = await getUsers({ UsersModel: mockUsersModel });
        expect(users).toEqual([{ id: 1, name: 'Test User' }]);
        expect(mockUsersModel.findAll).toHaveBeenCalled();
    });
});
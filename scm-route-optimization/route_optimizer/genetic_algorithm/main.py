import pandas as pd
from datetime import datetime
import random
import os
import sys
current_file_path = os.path.abspath(__file__)
project_root = os.path.dirname(os.path.dirname(current_file_path))
if project_root not in sys.path:
    sys.path.append(project_root)

MAX_SELECTED_ROUTES = 20  
POPULATION_SIZE = 100  
GENERATIONS = 200 
MUTATION_RATE = 0.1  

def create_initial_population(route_data):
    population = []
    for _ in range(POPULATION_SIZE):
        individual = random.sample(route_data, min(MAX_SELECTED_ROUTES, len(route_data)))
        population.append(individual)
    return population

def fitness(individual, demand):
    total_cost = sum(route['total_cost'] for route in individual)
    total_weight = sum(route['weight'] for route in individual)
    return total_cost if total_weight >= demand else float('inf') 

def is_enough(individual, demand):
    total_weight = sum(route['weight'] for route in individual)
    return total_weight >= demand

def selection(population, demand):
    population.sort(key=lambda ind: fitness(ind, demand))  
    return population[:POPULATION_SIZE // 2]

def crossover(parent1, parent2):
    split = random.randint(1, len(parent1) - 1)
    child = parent1[:split] + parent2[split:]
    child = list({route['route_id']: route for route in child}.values())  # Ensure unique routes
    return child[:MAX_SELECTED_ROUTES]

def mutate(individual, route_data):
    if random.random() < MUTATION_RATE:
        replace_index = random.randint(0, len(individual) - 1)
        individual[replace_index] = random.choice(route_data)
    return individual

def choose_from_best_generation(best_individual, demand):
    weight_sum = 0
    solution = []

    for ind in best_individual:
        weight_sum+=ind['weight']
        solution.append(ind)
        if weight_sum >=demand: 
            break
    return solution


def optimize(route_data, demand, deadline):
    # Initialize population
    population = create_initial_population(route_data=route_data)

    # Genetic algorithm process
    for generation in range(GENERATIONS):
        # Select parents
        parents = selection(population, demand)
        next_population = parents.copy()
        
        # Generate children through crossover
        while len(next_population) < POPULATION_SIZE:
            parent1, parent2 = random.sample(parents, 2)
            child = mutate(crossover(parent1, parent2), route_data)
            next_population.append(child)
        
        population = next_population

        # Check for early stopping if any solution meets the demand
        best_individual = min(population, key=lambda ind: fitness(ind, demand))
        if is_enough(best_individual, demand):
            print(f"Stopping early at generation {generation} as demand has been met.")
            best_solution = choose_from_best_generation(best_individual, demand)
            return best_solution

    # Return the best solution found if demand not met within generations
    best_individual = min(population, key=lambda ind: fitness(ind, demand))
    best_solution = choose_from_best_generation(best_individual, demand)
    return best_solution


if __name__=='__main__':
    destination = {
        'id': 'DESTINATION_TEST',
        'address': 'ĐT 746, Xã Đât Cuốc, huyện Bắc tân Uyên, Tỉnh Bình Dương Tân Uyên 75358 Bình Dương',
    }
    route_data = [{'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 22084.2701108176, 'total_cost': 75571.00874718123, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 19875.84309973584, 'total_cost': 73362.58173609947, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 16563.2025831132, 'total_cost': 70049.94121947684, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 9937.92154986792, 'total_cost': 63424.66018623155, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_1_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['261 KP. 3, QL. 1A, TT. Bến Lức, H. Bến Lức, Long An', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 5486.738636363636, 'goods_cost': 8833.70804432704, 'total_cost': 62320.44668069067, 'travel_hours': 2.22, 'travel_kms': 0.845}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 60101.885227666615, 'total_cost': 108991.45113675753, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 54091.69670489996, 'total_cost': 102981.26261399087, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 45076.41392074996, 'total_cost': 93965.97982984087, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 27045.84835244998, 'total_cost': 75935.4142615409, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_2_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['Thôn 3, Bắc Ruộng, Tánh Linh, Bình Thuận', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 889.5659090909091, 'goods_cost': 24040.754091066647, 'total_cost': 72930.32000015756, 'travel_hours': 2.4, 'travel_kms': 0.137}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 76679.9911036602, 'total_cost': 125400.73428547838, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 69011.99199329418, 'total_cost': 117732.73517511236, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 57509.99332774516, 'total_cost': 106230.73650956334, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 34505.99599664709, 'total_cost': 83226.73917846527, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_3_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['785-787 Cách Mạng Tháng tám, Khu Phố 2, Phường 3, Thành Phố Tây Ninh, Tây Ninh', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 720.7431818181818, 'goods_cost': 30671.99644146408, 'total_cost': 79392.73962328226, 'travel_hours': 2.4, 'travel_kms': 0.111}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 62647.4100326929, 'total_cost': 112082.40321451108, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 56382.6690294236, 'total_cost': 105817.66221124178, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 46985.557524519674, 'total_cost': 96420.55070633785, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 28191.3345147118, 'total_cost': 77626.32769652997, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_4_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['Số 15, Tổ 1, Ấp An Long, Xã An Thạnh Trung, Huyện Chợ Mới, An Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1434.993181818182, 'goods_cost': 25058.96401307716, 'total_cost': 74493.95719489534, 'travel_hours': 4.6, 'travel_kms': 0.221}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '66LD 94467', 'weight': 20, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 79520.09199346698, 'total_cost': 128987.55108437607, 'travel_hours': 4.47, 'travel_kms': 0.226}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '51LD 38199', 'weight': 18, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 71568.08279412027, 'total_cost': 121035.54188502936, 'travel_hours': 4.47, 'travel_kms': 0.226}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '66LD 93106', 'weight': 15, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 59640.068995100235, 'total_cost': 109107.52808600932, 'travel_hours': 4.47, 'travel_kms': 0.226}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '53LD 10175', 'weight': 9, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 35784.04139706014, 'total_cost': 85251.50048796923, 'travel_hours': 4.47, 'travel_kms': 0.226}, {'route_id': 'company_5_DESTINATION_TEST', 'vehicle': '68LD 67509', 'weight': 8, 'routes': [['781 ấp 6B, X. Tân Hoà Châu Thành A, Hậu Giang', 'ĐT746, Đất Cuốc, Bắc Tân Uyên, Bình Dương, Việt Nam']], 'driver_cost': 48000.0, 'fuel_cost': 1467.4590909090912, 'goods_cost': 31808.03679738679, 'total_cost': 81275.49588829587, 'travel_hours': 4.47, 'travel_kms': 0.226}]
    demand = 5
    deadline = datetime(2023, 12, 31).date() 
     
    # main(suppliers=suppliers, parkings=parkings, vehicles=vehicles,
    #      destination=destination, demand=demand, deadline=deadline)
    print(optimize(route_data=route_data, demand=demand, deadline=deadline))

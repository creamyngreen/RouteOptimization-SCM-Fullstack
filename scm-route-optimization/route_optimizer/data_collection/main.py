'''
Data preprocessing here
'''
import os
import sys
current_file_path = os.path.abspath(__file__)
project_root = os.path.dirname(os.path.dirname(current_file_path))
if project_root not in sys.path:
    sys.path.append(project_root)
import pandas as pd

parkings = pd.read_csv(os.path.join(project_root, 'data_collection/parkings_v2.csv'))
suppliers = pd.read_csv(os.path.join(project_root, 'data_collection/suppliers_v2.csv'))
vehicles = pd.read_csv(os.path.join(project_root, 'data_collection/vehicles.csv'))
destination_v2 = pd.read_csv(os.path.join(project_root, 'data_collection/destination_v2.csv'))

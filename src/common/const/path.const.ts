import { join } from 'path';

// The root path of the project
export const PROJECT_ROOT_PATH = process.cwd();

// The name of the public folder
export const PUBLIC_FOLDER_NAME = 'public';

// The name of temporary folder
export const TEMP_FOLDER_NAME = 'temp';

// The names of the folders for each domain
export const ALCOHOLS_FOLDER_NAME = 'alcohols';
export const REVIEWS_FOLDER_NAME = 'reviews';
export const USERS_FOLDER_NAME = 'users';

// The name of the images folder
export const IMAGES_FOLDER_NAME = 'images';

// The path to the public folder
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// The paths to the folders for each domain
export const ALCOHOLS_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, ALCOHOLS_FOLDER_NAME);
export const REVIEWS_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, REVIEWS_FOLDER_NAME);
export const USERS_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, USERS_FOLDER_NAME);

// The paths to the images folders for each domain
export const ALCOHOLS_IMAGES_FOLDER_PATH = join(ALCOHOLS_FOLDER_PATH, IMAGES_FOLDER_NAME);
export const REVIEWS_IMAGES_FOLDER_PATH = join(REVIEWS_FOLDER_PATH, IMAGES_FOLDER_NAME);
export const USERS_IMAGES_FOLDER_PATH = join(USERS_FOLDER_PATH, IMAGES_FOLDER_NAME);

// The path to the temporary folder
export const TEMP_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMP_FOLDER_NAME);

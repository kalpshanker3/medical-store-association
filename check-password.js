const bcrypt = require('bcrypt');

// The hash from Supabase
const hash = '$2a$10$.Iniswihd8ijemvq7tWBxeCzZQl6ZNWj9ib3wxxwqv2lOm1DoKvGC';

// The password to check
const password = 'Kiddo#17';

bcrypt.compare(password, hash, function(err, result) {
  if (err) {
    console.error('Error comparing:', err);
  } else if (result) {
    console.log('✅ Password matches the hash!');
  } else {
    console.log('❌ Password does NOT match the hash.');
  }
}); 
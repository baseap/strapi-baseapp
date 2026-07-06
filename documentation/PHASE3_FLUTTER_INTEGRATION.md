# Phase 3: Flutter Integration with Strapi CMS

Complete guide for integrating the Strapi Heritage CMS with the Flutter app.

## Status

✅ **Models Created** (in BaseApp Flutter project):
- `StrapiPremiumCategory` — Customer-facing heritage categories
- `StrapiTrainingCategory` — Vendor training categories  
- `StrapiTrainingTrack` — Complete training courses with Launchpad integration

## Architecture Overview

The integration follows existing Flutter architecture patterns:

```
Presentation (UI)
    ↓ (uses)
BLoC / Cubit (State Management)
    ↓ (calls)
Use Cases (Business Logic)
    ↓ (uses)
Repository (Abstract Interface - Domain)
    ↓ (implemented by)
Repository Implementation (Concrete - Data)
    ↓ (calls)
Service (API Calls)
    ↓ (uses)
Supabase Edge Function (strapi-proxy)
    ↓ (calls)
Strapi Cloud API
    ↓ (returns)
Strapi CMS
```

## Models Created - Details

### 1. StrapiPremiumCategory
**File:** `lib/features/vendor_training/data/models/strapi_premium_category.dart`

Represents customer-facing heritage categories (one of 7 Pillars).

```dart
const category = StrapiPremiumCategory(
  id: 1,
  documentId: 'abc123xyz',
  name: 'Culinary Heritage & Foodways',
  slug: 'culinary-heritage-foodways',
  description: 'Traditional food preparation and culinary traditions',
  displayOrder: 1,
  isActive: true,
);

// From API response
final category = StrapiPremiumCategory.fromStrapiJson(apiJson);

// For caching
final json = category.toJson();
```

### 2. StrapiTrainingCategory
**File:** `lib/features/vendor_training/data/models/strapi_training_category.dart`

Represents vendor training categories with extended documentation.

```dart
const category = StrapiTrainingCategory(
  id: 1,
  documentId: 'abc123xyz',
  name: 'Culinary Heritage & Foodways',
  slug: 'culinary-heritage-foodways',
  whatItCovers: 'Explore the history and techniques of heritage cuisine...',
  researchLineage: 'Culinary anthropology and food heritage studies',
  displayOrder: 1,
);
```

### 3. StrapiTrainingTrack
**File:** `lib/features/vendor_training/data/models/strapi_training_track.dart`

Represents complete training courses with Launchpad integration.

**Key Launchpad Fields:**
- `applicableLaunchpadTracks` — Which vendor tracks this applies to
  - `cultural_experience`
  - `service`
  - `product`
  - `health_activity`

- `recommendedOnboardingStage` — When to present training to vendor
  - `pre_certification` — Before certification assessment
  - `post_certification` — After first certification passes
  - `tier_progression` — To unlock higher tiers
  - `anytime` — Always available

- `requiredCertificationTier` — Minimum tier (1-5) to access
  - null = available to all tiers
  - Example: 3 = Tier 3+ only

- `strapiCourseId` — Links to external course system
  - Used by Supabase STM (Skill Training Module) for enrollment tracking
  - Format: string (flexible for different ID formats)
  - Currently stubbed, populated in content sprint

- `vendorPrepRequired` — Whether vendor must complete pre-work
  - true = read material, complete questionnaire, etc.
  - false = can start immediately

```dart
const track = StrapiTrainingTrack(
  id: 1,
  documentId: 'xyz789abc',
  title: 'Heritage Standards Certification',
  slug: 'heritage-standards-cert',
  description: 'Learn cultural heritage standards and best practices',
  durationHours: 40.0,
  difficultyLevel: 'intermediate',
  applicableLaunchpadTracks: ['cultural_experience'],
  recommendedOnboardingStage: 'post_certification',
  requiredCertificationTier: null,
  strapiCourseId: 'heritage_standards_101',
  vendorPrepRequired: false,
  isActive: true,
);
```

## Next Implementation Steps

### Step 1: Create Mappers
Convert Strapi API responses to Dart models.

**File:** `lib/features/vendor_training/data/mappers/strapi_training_mapper.dart`

```dart
class StrapiTrainingMapper {
  static StrapiTrainingTrack toTrainingTrack(Map<String, dynamic> json) {
    return StrapiTrainingTrack.fromStrapiJson(json);
  }
  
  static List<StrapiTrainingTrack> toTrainingTrackList(List<dynamic> list) {
    return list
        .map((json) => StrapiTrainingTrack.fromStrapiJson(json as Map<String, dynamic>))
        .toList();
  }
  
  // Similar for categories...
}
```

### Step 2: Create Services
Implement API calls via Supabase Edge Function.

**File:** `lib/features/vendor_training/data/services/strapi_training_service.dart`

```dart
class StrapiTrainingService {
  final SupabaseClient _supabaseClient;
  
  StrapiTrainingService(this._supabaseClient);
  
  Future<List<StrapiTrainingTrack>> getTrainingTracks({
    String? applicableTrack,
    String? recommendedStage,
  }) async {
    final filters = <String, dynamic>{};
    if (applicableTrack != null) {
      filters['applicable_launchpad_tracks'] = {'\$contains': applicableTrack};
    }
    if (recommendedStage != null) {
      filters['recommended_onboarding_stage'] = {'\$eq': recommendedStage};
    }
    
    final response = await _supabaseClient.functions.invoke(
      'strapi-proxy',
      body: {
        'endpoint': '/training-tracks',
        'filters': filters,
        'populate': '*',
      },
    );
    
    final data = response['data'] as List;
    return StrapiTrainingMapper.toTrainingTrackList(data);
  }
}
```

### Step 3: Create Repository Interface (Domain)
Define abstract contract.

**File:** `lib/features/vendor_training/domain/repositories/strapi_training_repository.dart`

```dart
abstract class StrapiTrainingRepository {
  Future<Either<Failure, List<StrapiTrainingTrack>>> getTrainingTracks({
    String? applicableTrack,
    String? recommendedStage,
  });
  
  Future<Either<Failure, List<StrapiTrainingCategory>>> getTrainingCategories();
  
  Future<Either<Failure, List<StrapiPremiumCategory>>> getPremiumCategories();
}
```

### Step 4: Implement Repository (Data)
Concrete implementation.

**File:** `lib/features/vendor_training/data/repositories/strapi_training_repository_impl.dart`

```dart
class StrapiTrainingRepositoryImpl implements StrapiTrainingRepository {
  final StrapiTrainingService _service;
  
  StrapiTrainingRepositoryImpl(this._service);
  
  @override
  Future<Either<Failure, List<StrapiTrainingTrack>>> getTrainingTracks({
    String? applicableTrack,
    String? recommendedStage,
  }) async {
    try {
      final tracks = await _service.getTrainingTracks(
        applicableTrack: applicableTrack,
        recommendedStage: recommendedStage,
      );
      return Right(tracks);
    } catch (e) {
      return Left(StrapiFailure(message: e.toString()));
    }
  }
  
  // ... other methods
}
```

### Step 5: Create Use Cases (Domain)
Business logic layer.

**File:** `lib/features/vendor_training/domain/usecases/get_training_tracks_usecase.dart`

```dart
class GetTrainingTracksUseCase {
  final StrapiTrainingRepository _repository;
  
  GetTrainingTracksUseCase(this._repository);
  
  Future<Either<Failure, List<StrapiTrainingTrack>>> call({
    String? applicableTrack,
    String? recommendedStage,
  }) async {
    return _repository.getTrainingTracks(
      applicableTrack: applicableTrack,
      recommendedStage: recommendedStage,
    );
  }
}
```

### Step 6: Create BLoC/Cubit (Presentation)
State management.

**File:** `lib/features/vendor_training/presentation/bloc/strapi_training_cubit.dart`

```dart
class StrapiTrainingCubit extends Cubit<StrapiTrainingState> {
  final GetTrainingTracksUseCase _getTracksUseCase;
  
  StrapiTrainingCubit(this._getTracksUseCase) 
    : super(const StrapiTrainingState());
  
  Future<void> fetchTrainingTracks({
    String? applicableTrack,
    String? recommendedStage,
  }) async {
    emit(state.copyWith(isLoading: true));
    
    final result = await _getTracksUseCase(
      applicableTrack: applicableTrack,
      recommendedStage: recommendedStage,
    );
    
    result.fold(
      (failure) => emit(state.copyWith(
        failure: failure,
        isLoading: false,
      )),
      (tracks) => emit(state.copyWith(
        tracks: tracks,
        isLoading: false,
      )),
    );
  }
}
```

### Step 7: Register in DI (lib/di/modules/)
Add to dependency injection.

```dart
void _setupStrapiTraining(GetIt getIt) {
  // Services
  getIt.registerLazySingleton(
    () => StrapiTrainingService(Supabase.instance.client),
  );
  
  // Repositories
  getIt.registerLazySingleton<StrapiTrainingRepository>(
    () => StrapiTrainingRepositoryImpl(getIt<StrapiTrainingService>()),
  );
  
  // Use Cases
  getIt.registerLazySingleton(
    () => GetTrainingTracksUseCase(getIt<StrapiTrainingRepository>()),
  );
  
  // BLoC/Cubit
  getIt.registerFactory(
    () => StrapiTrainingCubit(getIt<GetTrainingTracksUseCase>()),
  );
}
```

## API Query Examples

### Get Training Tracks for Cultural Experience Vendors (Post-Certification)

```dart
// In presentation layer
final cubit = context.read<StrapiTrainingCubit>();
await cubit.fetchTrainingTracks(
  applicableTrack: 'cultural_experience',
  recommendedStage: 'post_certification',
);
```

**Generated Strapi query:**
```
GET /api/training-tracks
?filters[applicable_launchpad_tracks][$contains]=cultural_experience
&filters[recommended_onboarding_stage][$eq]=post_certification
&populate=*
```

### Get Pre-Certification Preparation

```dart
await cubit.fetchTrainingTracks(
  applicableTrack: 'cultural_experience',
  recommendedStage: 'pre_certification',
);
```

### Get Health Activity Trainings

```dart
await cubit.fetchTrainingTracks(
  applicableTrack: 'health_activity',
);
```

## Supabase Edge Function: strapi-proxy

The Flutter app calls a Supabase edge function (strapi-proxy) which:

1. Adds STRAPI_TOKEN authentication
2. Proxies requests to Strapi Cloud API  
3. Handles errors and timeouts
4. Can cache responses (optional)

**Requirements:**
- Function must be deployed at: `supabase/functions/strapi-proxy/index.ts`
- STRAPI_TOKEN stored in Supabase Secrets
- Handles query parameter construction from filters

**Example Edge Function:**

```typescript
// supabase/functions/strapi-proxy/index.ts
Deno.serve(async (req) => {
  const { endpoint, filters, populate } = await req.json();
  
  const token = Deno.env.get('STRAPI_TOKEN');
  if (!token) {
    return new Response(JSON.stringify({ error: 'STRAPI_TOKEN not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  let apiUrl = `https://positive-acoustics-345fa51dc4.strapiapp.com/api${endpoint}`;
  
  // Add query parameters
  const params = new URLSearchParams();
  if (filters) {
    params.append('filters', JSON.stringify(filters));
  }
  if (populate) {
    params.append('populate', populate);
  }
  
  if (params.toString()) {
    apiUrl += '?' + params.toString();
  }
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
});
```

## Integration with Vendor Onboarding

When assigning tracks to a new vendor:

1. **Fetch applicable training tracks** from Strapi based on assigned track type
   ```dart
   final tracks = await _cubit.fetchTrainingTracks(
     applicableTrack: 'cultural_experience',
     recommendedStage: 'pre_certification',
   );
   ```

2. **Display training requirements** in vendor onboarding UI
   - Show required trainings before certification
   - Show optional advanced trainings

3. **Extract strapi_course_id** for enrollment
   ```dart
   final courseId = track.strapiCourseId;  // e.g., "heritage_standards_101"
   ```

4. **Send to Supabase STM** (Skill Training Module) for enrollment
   ```dart
   await supabase
     .from('vendor_course_enrollments')
     .insert({
       'vendor_id': vendorId,
       'strapi_course_id': courseId,
       'track_name': 'cultural_experience',
       'enrolled_at': DateTime.now(),
     });
   ```

5. **On completion, trigger tier unlock** workflows
   - Supabase AVI system checks `recommended_onboarding_stage`
   - If `tier_progression`, unlock next tier
   - If `post_certification`, award coaching points

## Testing

### Unit Tests - Model Deserialization

```dart
test('StrapiTrainingTrack parses Strapi v5 JSON correctly', () {
  final json = {
    'id': 1,
    'documentId': 'abc123',
    'attributes': {
      'title': 'Test Track',
      'slug': 'test-track',
      'applicable_launchpad_tracks': ['cultural_experience'],
      'recommended_onboarding_stage': 'post_certification',
      'strapi_course_id': 'test_101',
      'is_active': true,
      'createdAt': '2026-07-06T12:00:00.000Z',
    },
  };
  
  final track = StrapiTrainingTrack.fromStrapiJson(json);
  
  expect(track.id, 1);
  expect(track.title, 'Test Track');
  expect(track.applicableLaunchpadTracks, ['cultural_experience']);
  expect(track.recommendedOnboardingStage, 'post_certification');
  expect(track.strapiCourseId, 'test_101');
});
```

### Integration Tests - API Calls

```dart
test('fetchTrainingTracks fetches cultural_experience pre-cert trainings', () async {
  final cubit = StrapiTrainingCubit(mockGetTracksUseCase);
  
  await cubit.fetchTrainingTracks(
    applicableTrack: 'cultural_experience',
    recommendedStage: 'pre_certification',
  );
  
  expect(cubit.state.isLoading, false);
  expect(cubit.state.tracks, isNotEmpty);
  expect(cubit.state.tracks?.first.applicableLaunchpadTracks,
      contains('cultural_experience'));
});
```

## Files to Create (Minimal)

**High Priority** (for MVP):
1. ✅ Models (done)
2. Mappers (`strapi_training_mapper.dart`)
3. Services (`strapi_training_service.dart`)
4. Repositories (interface + impl)
5. Use Cases (`get_training_tracks_usecase.dart`)
6. BLoC/Cubit (`strapi_training_cubit.dart`)

**Lower Priority** (for full integration):
7. Update vendor onboarding screens
8. Add DI registration
9. Implement local caching (Hive)
10. Add error handling (Failure classes)

## Related Documentation

- `PHASE2_SETUP.md` — Strapi CMS setup and testing
- `../BaseApp/documentation/COMPLETED/Launchpad Multi-Track Implementation Plan.md` — Vendor onboarding details
- Strapi CMS schemas: `/src/api/training-track/content-types/training-track/schema.json`

## Architecture Checklist

- [ ] ✅ Models created with fromStrapiJson/toJson
- [ ] Mappers layer complete
- [ ] Services call edge function (no direct Strapi API)
- [ ] Repository interface in domain layer
- [ ] Repository implementation in data layer
- [ ] Use Cases handle business logic
- [ ] BLoC manages state
- [ ] DI registration complete
- [ ] Constructor injection (no getIt in presentation)
- [ ] Error handling with Sealed Failure classes
- [ ] Unit tests for model deserialization
- [ ] Integration tests for API calls
- [ ] No data model imports in presentation
- [ ] No setState() in presentation
- [ ] L10n for all user-facing strings
- [ ] Accessibility: Semantics + tooltips

---

**Status:** Phase 3 models complete, ready for mapper/service layer
**Commits:** BaseApp 9410e6301 (Phase 3 models added)
**Next:** Create complete implementation of mapper → service → repository → use case → BLoC chain

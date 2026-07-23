<?php

declare(strict_types=1);

namespace App\Core;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of Model
 */
abstract class BaseRepository
{
    /**
     * @var class-string<TModel>
     */
    protected string $modelClass;

    /**
     * Get instance of the associated model.
     *
     * @return TModel
     */
    protected function model(): Model
    {
        return app($this->modelClass);
    }

    /**
     * Find model by primary key.
     *
     * @return TModel|null
     */
    public function find(int|string $id): ?Model
    {
        /** @var TModel|null $result */
        $result = $this->model()->newQuery()->find($id);

        return $result;
    }

    /**
     * Find model by primary key or fail.
     *
     * @return TModel
     */
    public function findOrFail(int|string $id): Model
    {
        /** @var TModel $result */
        $result = $this->model()->newQuery()->findOrFail($id);

        return $result;
    }

    /**
     * Get all records.
     *
     * @return Collection<int, TModel>
     */
    public function all(): Collection
    {
        /** @var Collection<int, TModel> $result */
        $result = $this->model()->newQuery()->get();

        return $result;
    }

    /**
     * Paginate records.
     *
     * @return LengthAwarePaginator<int, TModel>
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, TModel> $result */
        $result = $this->model()->newQuery()->paginate($perPage);

        return $result;
    }

    /**
     * Create new model record.
     *
     * @param  array<string, mixed>  $attributes
     * @return TModel
     */
    public function create(array $attributes): Model
    {
        /** @var TModel $result */
        $result = $this->model()->newQuery()->create($attributes);

        return $result;
    }

    /**
     * Update model record by ID.
     *
     * @param  array<string, mixed>  $attributes
     * @return TModel
     */
    public function update(int|string $id, array $attributes): Model
    {
        $record = $this->findOrFail($id);
        $record->update($attributes);

        return $record;
    }

    /**
     * Delete model record by ID.
     */
    public function delete(int|string $id): bool
    {
        $record = $this->findOrFail($id);

        return (bool) $record->delete();
    }
}
